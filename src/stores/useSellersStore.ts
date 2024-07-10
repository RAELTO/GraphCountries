import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

import type {
  Invoices,
} from '../interfaces/invoice.interface'

import type {
  Sellers,
} from '../interfaces/seller.interface'

export const useSellersStore = defineStore('sellers', () => {
  const storedSellers = useStorage<Sellers[]>('sellers', [])
  const loading = ref<Boolean>(false)
  const loadingInvoice = ref<Boolean>(false)
  const winner = ref<Sellers>({
    id: 0,
    name: '',
    identification: '',
    observations: '',
    status: '',
    points: 0,
    image: '',
    invoice: null,
    product: ''
  })
  const showDialog = ref(false)
  const totalPoints = ref<number>(0)
  const email: string = import.meta.env.VITE_ALEGRA_API_EMAIL
  const token: string = import.meta.env.VITE_ALEGRA_API_TOKEN
  const invoicesUrl: string = import.meta.env.VITE_ALEGRA_API_INVOICES_URL
  const encodedCredentials: string = btoa(`${email}:${token}`)

  const getSellers = async () => {
    try {
      const response = await axios.get('https://api.alegra.com/api/v1/sellers', {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'accept': 'application/json'
        },
        params: {
          start: 0,
          limit: 5,
          status: 'active'
        }
      })
      storedSellers.value = response.data.map((seller: Sellers) => ({ ...seller, points: 0, image: '', invoice: null, product: `Product from ${seller.name}` }))
    } catch (err) {
      throw new Error(`${err}`)
    }
  }

  const updateSellersImages = (images: string) => {
    const sellersUpdating = storedSellers.value
    sellersUpdating.forEach((item, index) => {
      if (images[index]) {
        item.image = images[index]
      }
    })
    storedSellers.value = sellersUpdating
  }

  const updateSellerPoints = (index: number) => {
    const currentPoints = storedSellers.value[index].points
    const newPoints = currentPoints + 3
    if (newPoints >= 20) {
      storedSellers.value[index].points = 20
      winner.value = storedSellers.value[index]
      totalPoints.value = storedSellers.value.reduce((acc, seller) => acc + seller.points, 0)
      getInvoices(index)
      showDialog.value = true
    } else {
      storedSellers.value[index].points = newPoints
    }
    storedSellers.value = storedSellers.value.sort((a, b) => b.points - a.points)
    loading.value = true
  }

  const resetSellersPoints = () => {
    storedSellers.value.forEach(e => e.points = 0)
  }

  const getInvoices = async (index: number) => {
    loadingInvoice.value = true
    try {
      const response = await axios.get(invoicesUrl, {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'accept': 'application/json'
        }
      })
      if (response.data) {
        let action = false
        let invoiceId = null
        const invoiceIndex = response.data.findIndex((e: Invoices) => e.seller.id === storedSellers.value[index].id)
        if (invoiceIndex !== -1) {
          action = true
          invoiceId = response.data[invoiceIndex].id
        }
        createOrUpdateInvoice(storedSellers.value[index], invoiceId, action)
      }
    } catch (err) {
      throw new Error(`${err}`)
    }
  }

  const createOrUpdateInvoice = async (seller: Sellers, invoiceId: string, action: boolean) => {
    const now = new Date().toISOString().split('T')[0]
    const invoiceData = {
      client: { id: 1 },
      status: 'draft',
      items: [
        {
          name: 'Product 1',
          discount: 0,
          observations: 'none',
          price: 5000,
          quantity: totalPoints.value,
          description: 'Lorem ipsum',
          id: 1
        }
      ],
      dueDate: now,
      date: now,
      observations: 'Invoice observations',
      seller: seller.id
    }
    const headersData = {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    
    const url = `${invoicesUrl}${action ? `/${invoiceId}` : ''}`
    const method = action ? 'put' : 'post'
    
    try {
      const response = await axios({
        method,
        url,
        data: invoiceData,
        headers: headersData
      })
  
      if (response.data) {
        seller.invoice = response.data
        storedSellers.value = [...storedSellers.value]
        loadingInvoice.value = false
      }
    } catch (err) {
      throw new Error(`${err}`)
    }
  }

  const sortedSellers = computed(() => {
    return storedSellers.value.sort((a, b) => b.points - a.points)
  })

  return {
    storedSellers,
    loading,
    loadingInvoice,
    sortedSellers,
    winner,
    showDialog,
    totalPoints,
    getSellers,
    updateSellersImages,
    updateSellerPoints,
    resetSellersPoints,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSellersStore, import.meta.hot))
}

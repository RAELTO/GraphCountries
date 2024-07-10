import { defineStore, acceptHMRUpdate } from 'pinia'
import { axiosInstance } from '../plugins/axios'
import { ref } from 'vue'
import { useSellersStore } from '../stores/useSellersStore'

export const useImagesStore = defineStore('images', () => {
  const images = ref<string[]>([])
  const error = ref(null)
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
  const searchEngineId = import.meta.env.VITE_SEARCH_ENGINE_ID
  const sellersStore = useSellersStore()
  const loadingImgs = ref<Boolean>(true)

  const searchImages = async (searchQuery: string) => {
    error.value = null
    try {
      const response = await axiosInstance.get(`/customsearch/v1`, {
        params: {
          key: apiKey,
          cx: searchEngineId,
          q: searchQuery,
          searchType: 'image',
          safe: 'medium',
          num: 6
        }
      })

      if (response.data && response.data.items) {
        const images = response.data.items.map((img: string) => img.link)

        sellersStore.updateSellersImages(images)
        loadingImgs.value = false
      }
    } catch (err) {
      throw new Error(`${err}`)
    }
  }

  return {
    images,
    loadingImgs,
    searchImages
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useImagesStore, import.meta.hot))
}

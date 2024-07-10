import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSellersStore } from '../../stores/useSellersStore'
import axios from 'axios'
import { vi } from 'vitest'

vi.mock('axios')
const mockedAxios = axios as typeof axios & {
  get: ReturnType<typeof vi.fn>,
}

describe('useSellersStore', () => {
  let sellersStore: ReturnType<typeof useSellersStore>
  
  beforeEach(() => {
    setActivePinia(createPinia())
    sellersStore = useSellersStore()
  })
  
  it('fetches sellers correctly', async () => {
    const sellers = [
      {
        id: 1,
        identification: '',
        image: '',
        invoice: null,
        name: '',
        observations: '',
        points: 0,
        product: 'Product from ',
        status: ''
      }
    ]
    mockedAxios.get.mockResolvedValue({ data: sellers })
    await sellersStore.getSellers()
    expect(sellersStore.storedSellers).toEqual(sellers)
  })
})

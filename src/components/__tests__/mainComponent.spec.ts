import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { expect, test, vi } from 'vitest'
import MainComponent from '../MainComponent.vue'
import { useQuery } from '@vue/apollo-composable'
import { createTestingPinia } from '@pinia/testing'
import { useRouter } from 'vue-router'

vi.mock('@vue/apollo-composable', () => ({
  useQuery: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

test('renders the component properly', () => {
  vi.mocked(useQuery).mockReturnValue({
    result: ref({ countries: [] }),
    loading: ref(false),
    refetch: vi.fn()
  })

  const wrapper = mount(MainComponent, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  expect(wrapper.exists()).toBe(true)
})

test('displays loading spinner when loading is true', () => {
  vi.mocked(useQuery).mockReturnValue({
    result: ref({ countries: [] }),
    loading: ref(true),
    refetch: vi.fn()
  })

  const wrapper = mount(MainComponent, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  expect(wrapper.find('.spinner-border').exists()).toBe(true)
})

test('updates searchQuery and searchType when handleSearchUpdate is called', async () => {
    vi.mocked(useQuery).mockReturnValue({
      result: ref({ countries: [] }),
      loading: ref(false),
      refetch: vi.fn(),
    })
  
    const wrapper = mount(MainComponent, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    })
  
    const instance = wrapper.vm as any
  
    instance.handleSearchUpdate({ query: 'Brazil', type: 'name' })
  
    await instance.$nextTick()
  
    expect(instance.searchQuery).toBe('Brazil')
    expect(instance.searchType).toBe('name')
  })

test('calls router.push with the correct parameters when goToDetails is called', async () => {
  const mockPush = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush
  } as any)

  const mockCountry = {
    code: 'AR',
    name: 'Argentina',
    capital: 'Buenos Aires',
    continent: {
      code: 'SA',
      name: 'South America'
    },
    currency: 'ARS',
    languages: [{ code: 'es', name: 'Spanish', native: 'Español' }]
  }

  vi.mocked(useQuery).mockReturnValue({
    result: ref({ countries: [mockCountry] }),
    loading: ref(false),
    refetch: vi.fn()
  })

  const wrapper = mount(MainComponent, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

  const instance = wrapper.vm as any
  instance.goToDetails(mockCountry)

  expect(mockPush).toHaveBeenCalledWith({
    name: 'details',
    params: { code: 'AR' }
  })
})

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchComponent from '../SearchComponent.vue'
import { createTestingPinia } from '@pinia/testing'

describe('SearchComponent.vue', () => {

  it('renders the search input', () => {
    const wrapper = mount(SearchComponent, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    })
    expect(wrapper.find('.search-bar').exists()).toBe(true)
  })

})

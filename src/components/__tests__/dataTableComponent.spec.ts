import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DataTable from '../DataTable.vue'

describe('DataTable.vue', () => {
  const mockColumns = [
    { label: 'Country Name', field: 'name' },
    { label: 'Code', field: 'code' },
    { label: 'Capital', field: 'capital' },
    { label: 'Continent', field: 'continent' },
    { label: 'Currency', field: 'currency' }
  ]

  const mockData = [
    {
      name: 'Argentina',
      code: 'AR',
      capital: 'Buenos Aires',
      continent: 'South America',
      currency: 'ARS'
    }
  ]

  it('renders the table with correct columns and data', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        fromMainComponent: true
      }
    })

    const headers = wrapper.findAll('thead th')
    expect(headers.length).toBe(mockColumns.length)
    mockColumns.forEach((col, index) => {
      expect(headers[index].text()).toBe(col.label)
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(mockData.length)
    const firstRowCells = rows[0].findAll('td')
    expect(firstRowCells.length).toBe(mockColumns.length)

    // Check each cell for correct data
    expect(firstRowCells[0].text()).toContain('Argentina')
    expect(firstRowCells[1].text()).toContain('AR')
    expect(firstRowCells[2].text()).toContain('Buenos Aires')
    expect(firstRowCells[3].text()).toContain('South America')
    expect(firstRowCells[4].text()).toContain('ARS')
  })

  it('emits the rowClick event when a row is clicked', async () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        fromMainComponent: true
      }
    })

    const rows = wrapper.findAll('tbody tr')
    await rows[0].trigger('click')

    // Check if the event is emitted with the correct payload
    expect(wrapper.emitted().rowClick).toBeTruthy()
    expect(wrapper.emitted().rowClick[0]).toEqual([mockData[0]])
  })

  it('renders flag image correctly when fromMainComponent is true', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        fromMainComponent: true
      }
    })

    const flagImg = wrapper.find('img[alt="flag"]')
    expect(flagImg.exists()).toBe(true)
    expect(flagImg.attributes('src')).toBe('https://flagcdn.com/w20/ar.png')
  })
})

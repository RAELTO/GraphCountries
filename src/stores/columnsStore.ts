import { defineStore } from 'pinia'
import type { Column } from '@/interfaces/Table'
import type { Country } from '@/interfaces/Country'

export const useColumnsStore = defineStore('columns', () => {
  // Columns for the main country list
  const mainColumns: Column<Country>[] = [
    { label: 'Country Name', field: 'name' },
    { label: 'Code', field: 'code' },
    { label: 'Capital', field: 'capital' },
    { label: 'Continent', slot: 'continent' },
    { label: 'Currency', field: 'currency' },
    { label: 'Languages', slot: 'languages' },
    { label: 'Phone', field: 'phone' }
  ]

  // Columns for the country details view
  const detailColumns: Column<Country>[] = [
    { label: 'Code', field: 'code' },
    { label: 'Name', field: 'name' }
  ]

  return {
    mainColumns,
    detailColumns
  }
})

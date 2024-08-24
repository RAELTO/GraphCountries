import { defineStore } from 'pinia'
import type { Column } from '@/interfaces/Table'
import type { Country } from '@/interfaces/Country'

export const useColumnsStore = defineStore('columns', () => {
  const mainColumns: Column<Country>[] = [
    { label: 'Country Name', field: 'name' },
    { label: 'Code', field: 'code' },
    { label: 'Capital', field: 'capital' },
    { label: 'Continent', slot: 'continent' },
    { label: 'Currency', field: 'currency' },
    { label: 'Languages', slot: 'languages' },
    { label: 'Phone', field: 'phone' }
  ]

  const detailColumns: Column<Country>[] = [
    { label: 'Code', field: 'code' },
    { label: 'Name', field: 'name' }
  ]

  return {
    mainColumns,
    detailColumns
  }
})

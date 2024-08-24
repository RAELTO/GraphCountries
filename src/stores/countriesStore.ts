import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApolloClient } from '@vue/apollo-composable'
import getCountries from '@/graphql/queries/allCountries.gql'
import countryByCode from '@/graphql/queries/countryByCode.gql'
import type { Country } from '@/interfaces/Country'

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])
  const country = ref<Country | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { client } = useApolloClient()

  const fetchCountries = async (filters: any) => {
    loading.value = true
    try {
      const result = await client.query({
        query: getCountries,
        variables: filters,
        fetchPolicy: 'no-cache'
      })
      countries.value = result.data.countries
    } catch (e) {
      error.value = 'Failed to fetch countries'
    } finally {
      loading.value = false
    }
  }

  const fetchCountryByCode = async (code: string) => {
    loading.value = true
    try {
      const result = await client.query({
        query: countryByCode,
        variables: { code },
        fetchPolicy: 'network-only'
      })
      country.value = result.data.country
    } catch (e) {
      error.value = 'Failed to fetch country'
    } finally {
      loading.value = false
    }
  }

  return {
    countries,
    country,
    loading,
    error,
    fetchCountries,
    fetchCountryByCode
  }
})

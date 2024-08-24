import { ref } from 'vue'
import { useApolloClient  } from '@vue/apollo-composable'
import type { FetchPolicy } from '@apollo/client'

export function useGraphQL() {
  const { client } = useApolloClient()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const executeQuery = async (query: any, variables: any = {}, fetchPolicy: FetchPolicy = 'network-only') => {
    loading.value = true
    error.value = null
    try {
      const result = await client.query({
        query,
        variables,
        fetchPolicy,
      })
      return result.data
    } catch (err) {
      console.error('Failed to fetch data:', err)
      error.value = 'Failed to load data. Please try again later.'
      return null
    } finally {
      loading.value = false
    }
  }

  return { executeQuery, loading, error }
}

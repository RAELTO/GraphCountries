<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import getCountries from '@/graphql/queries/allCountries.gql'
import SearchBar from './SearchBar.vue'
import DataTable from './DataTable.vue'
import { useColumnsStore } from '@/stores/columnsStore' // Import the columns store
import type { Country } from '@/interfaces/Country'

const searchQuery = ref('')
const searchType = ref('name')
const router = useRouter()

const columnsStore = useColumnsStore()
const columns = columnsStore.mainColumns

const countries = ref<Country[]>([])

const filters = computed(() => {
  let filterObject: any = {}

  if (searchQuery.value) {
    if (searchType.value === 'name') {
      const formattedQuery = searchQuery.value.charAt(0).toUpperCase() + searchQuery.value.slice(1)
      filterObject = {
        name: { regex: `${formattedQuery}` }
      }
    } else if (searchType.value === 'code') {
      filterObject = {
        code: { eq: searchQuery.value.toUpperCase() }
      }
    } else if (searchType.value === 'continent') {
      filterObject = {
        continent: { regex: `${searchQuery.value.toUpperCase()}` }
      }
    }
  }

  return { filter: filterObject }
})

const { result, loading, refetch } = useQuery(getCountries, filters)

watch(result, (newResult) => {
  if (newResult && newResult.countries) {
    countries.value = [...newResult.countries]
  }
})

onMounted(() => {
  refetch()?.then((newResult) => {
    if (newResult.data && newResult.data.countries) {
      countries.value = [...newResult.data.countries]
    }
  })
})

const handleSearchUpdate = ({ query, type }: { query: string; type: string }) => {
  searchQuery.value = query
  searchType.value = type
}

const goToDetails = (row: Country) => {
  router.push({ name: 'details', params: { code: row.code } })
}
</script>

<template>
  <div class="container">
    <h1 class="text-center my-4">List of countries</h1>

    <div class="row mb-2">
      <div class="col-auto">
        <SearchBar @updateSearch="handleSearchUpdate" />
      </div>
    </div>

    <div v-if="loading" class="spinner-container">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <DataTable
      v-if="!loading && countries.length"
      :data="countries"
      :columns="columns"
      :from-main-component="true"
      @rowClick="goToDetails"
    >
      <template #languages="{ row }">
        <ul>
          <li v-for="language in row.languages" :key="language.code">
            {{ language.name }} ({{ language.native }})
          </li>
        </ul>
      </template>
      <template #continent="{ row }">
        {{ row.continent.name }} ({{ row.continent.code }})
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #007bff;
}
</style>

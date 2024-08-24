<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from './SearchBar.vue'
import DataTable from './DataTable.vue'
import { useColumnsStore } from '@/stores/columnsStore'
import { useGraphQL } from '@/composables/useGraph'
import getCountries from '@/graphql/queries/allCountries.gql'
import type { Country } from '@/interfaces/Country'

const searchQuery = ref('')
const searchType = ref('name')
const countries = ref<Country[]>([])
const router = useRouter()

const columnsStore = useColumnsStore()
const columns = columnsStore.mainColumns

const { executeQuery, loading, error } = useGraphQL()

const filters = computed(() => {
  let filterObject: any = {}

  if (searchQuery.value) {
    const formattedQuery = searchQuery.value.charAt(0).toUpperCase() + searchQuery.value.slice(1)
    
    if (searchType.value === 'name') {
      filterObject = { name: { regex: `${formattedQuery}` } }
    } else if (searchType.value === 'code') {
      filterObject = { code: { eq: searchQuery.value.toUpperCase() } }
    } else if (searchType.value === 'continent') {
      filterObject = { continent: { regex: `${searchQuery.value.toUpperCase()}` } }
    }
  }

  return filterObject
})

onMounted(async () => {
  const data = await executeQuery(getCountries, { filter: filters.value })
  countries.value = data?.countries || []
})

const handleSearchUpdate = async ({ query, type }: { query: string; type: string }) => {
  searchQuery.value = query
  searchType.value = type
  const data = await executeQuery(getCountries, { filter: filters.value })
  countries.value = data?.countries || []
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
      <div class="spinner-border" role="status" />
      <h5>Loading...</h5>
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

    <!-- No results found alert -->
    <div v-if="!loading && !countries.length && !error" class="alert alert-warning text-center">
      No records found.
    </div>

    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
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

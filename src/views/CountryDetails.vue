<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGraphQL } from '@/composables/useGraph'
import countryByCode from '@/graphql/queries/countryByCode.gql'
import DataTable from '@/components/DataTable.vue'
import { useColumnsStore } from '@/stores/columnsStore'
import type { Country } from '@/interfaces/Country'

const route = useRoute()
const router = useRouter()

const country = ref<Country | null>(null)
const { executeQuery, loading, error } = useGraphQL()

// Use the columns store
const columnsStore = useColumnsStore()
const columns = columnsStore.detailColumns

const fetchCountry = async (code: string) => {
  const data = await executeQuery(countryByCode, { code })
  country.value = data?.country || null
}

// Fetch country data on component mount
onMounted(() => {
  fetchCountry(route.params.code as string)
})

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="container">
    <h1 v-if="country && country.name" class="text-center my-4">{{ country.name }} details</h1>
    <div v-if="!country && !loading" class="alert alert-warning text-center">
      Please select a country from the home page.
    </div>

    <div class="mb-4">
      <a href="#" @click.prevent="goHome">&larr; Go Home</a>
    </div>

    <div v-if="loading" class="alert alert-info text-center">Loading details...</div>
    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <div
      v-if="country && country.states.length === 0 && country.subdivisions.length === 0"
      class="alert alert-warning text-center"
    >
      This country does not have any states or subdivisions.
    </div>

    <div v-if="country && (country.states?.length || country.subdivisions?.length)" class="mt-4">
      <h2>States</h2>
      <DataTable
        :data="
          country.subdivisions && country.subdivisions.length > 0
            ? country.subdivisions
            : country.states
        "
        :columns="columns"
        :from-main-component="false"
      />
    </div>
  </div>
</template>

<style scoped></style>

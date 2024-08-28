<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Column } from '@/interfaces/Table'

type T = any

const props = defineProps<{
  data: T[]
  columns: Column<T>[]
  fromMainComponent: boolean
}>()

const emit = defineEmits<{
  (e: 'rowClick', row: T): void
}>()

const itemsPerPage = ref(8)
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(props.data.length / itemsPerPage.value)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return props.data.slice(start, end)
})

const handleRowClick = (row: T) => {
  emit('rowClick', row)
}

const getFlagUrl = (countryCode: string): string => {
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`
}

const goToPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const visiblePages = computed(() => {
  const totalVisiblePages = 10
  const pages: number[] = []

  let startPage = Math.max(1, currentPage.value - Math.floor(totalVisiblePages / 2))
  let endPage = Math.min(totalPages.value, startPage + totalVisiblePages - 1)

  if (endPage - startPage < totalVisiblePages - 1) {
    startPage = Math.max(1, endPage - totalVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover table-bordered">
      <thead class="thead-dark">
        <tr>
          <th v-for="(column, index) in props.columns" :key="index" scope="col">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in paginatedData"
          :key="rowIndex"
          @click="handleRowClick(row)"
          :style="{ cursor: props.fromMainComponent ? 'pointer' : 'default' }"
        >
          <td v-for="(column, colIndex) in props.columns" :key="colIndex">
            <template v-if="props.fromMainComponent && column.field === 'name' && row.code">
              <img :src="getFlagUrl(row.code)" alt="flag" width="20" height="15" /> {{ ' ' }}
            </template>
            <template v-if="'slot' in column">
              <slot :name="column.slot" :row="row" :column="column" />
            </template>
            <template v-else>
              {{ row[column.field as keyof T] !== null ? row[column.field as keyof T] : 'N/A' }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination Controls -->
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="goToPage(currentPage - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item" v-if="visiblePages[0] > 1">
        <a class="page-link" href="#" @click.prevent="goToPage(1)">1</a>
      </li>

      <li class="page-item disabled" v-if="visiblePages[0] > 2">
        <span class="page-link">...</span>
      </li>

      <li
        v-for="page in visiblePages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
      </li>

      <li class="page-item disabled" v-if="visiblePages[visiblePages.length - 1] < totalPages - 1">
        <span class="page-link">...</span>
      </li>

      <li class="page-item" v-if="visiblePages[visiblePages.length - 1] < totalPages">
        <a class="page-link" href="#" @click.prevent="goToPage(totalPages)">{{ totalPages }}</a>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="goToPage(currentPage + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>

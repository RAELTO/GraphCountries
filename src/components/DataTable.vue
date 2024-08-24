<script setup lang="ts">
import type { Column } from '@/interfaces/Table'

type T = any

defineProps<{
  data: T[]
  columns: Column<T>[]
  fromMainComponent: boolean
}>()

const emit = defineEmits<{
  (e: 'rowClick', row: T): void
}>()

const getFlagUrl = (countryCode: string): string => {
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`
}

const handleRowClick = (row: T) => {
  emit('rowClick', row)
}
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover table-bordered">
      <thead class="thead-dark">
        <tr>
          <th v-for="(column, index) in columns" :key="index" scope="col">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          @click="handleRowClick(row)"
          :style="{ cursor: fromMainComponent ? 'pointer' : 'default' }"
        >
          <td v-for="(column, colIndex) in columns" :key="colIndex">
            <template v-if="fromMainComponent && column.field === 'name' && row.code">
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
</template>

<style scoped></style>

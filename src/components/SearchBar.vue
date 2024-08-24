<script setup lang="ts">
import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchType = ref('name')
const placeHolderText = ref('Search...')
const emit = defineEmits(['updateSearch'])

const performSearch = (event: KeyboardEvent | MouseEvent) => {
  if ((event instanceof KeyboardEvent && event.key === 'Enter') || event instanceof MouseEvent) {
    emit('updateSearch', { query: searchQuery.value, type: searchType.value })
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('updateSearch', { query: '', type: searchType.value })
}

watch(searchQuery, (newValue) => {
  if (newValue === '') {
    emit('updateSearch', { query: '', type: searchType.value })
  }
})

const changeSearchType = (type: string) => {
  searchType.value = type
  if (searchType.value === 'continent') {
    placeHolderText.value = 'For example EU'
  } else {
    placeHolderText.value = 'Search...'
  }
  emit('updateSearch', { query: searchQuery.value, type: searchType.value })
}
</script>

<template>
  <div class="search-bar mb-4 input-group">
    <button
      class="btn btn-outline-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Search by {{ searchType === 'name' ? 'Name' : searchType === 'code' ? 'Code' : 'Continent' }}
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" @click="changeSearchType('name')">Name</a></li>
      <li><a class="dropdown-item" @click="changeSearchType('code')">Code</a></li>
      <li><a class="dropdown-item" @click="changeSearchType('continent')">Continent</a></li>
    </ul>
    <input
      type="text"
      class="form-control"
      :placeholder="placeHolderText"
      v-model="searchQuery"
      @keydown="performSearch"
    />
    <button v-if="searchQuery" class="btn-clear" @click="clearSearch">
      <i class="bi bi-x-circle"></i>
    </button>
    <button
      class="btn btn-outline-secondary"
      @click="performSearch"
      type="button"
      id="button-addon2"
    >
      <i class="bi bi-search"></i>
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.btn-clear {
  position: absolute;
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
  border: none;
  background: none;
  font-size: 15px;
  color: #aaa;
  cursor: pointer;
  padding: 0;
  z-index: 800;
}

.btn-clear:hover {
  color: #000;
}

.btn-clear:focus {
  outline: none;
}

.dropdown-item {
  cursor: pointer;
}
</style>

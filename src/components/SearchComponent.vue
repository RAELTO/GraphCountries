<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSellersStore } from '../stores/useSellersStore'
import { useImagesStore } from '../stores/useImagesStore'
import { ElMessage, ElDialog } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'

import type { Sellers } from '../interfaces/seller.interface'

const searchQuery = ref('')
const instructionsDialogVisible = ref(false)
const loadingImages = ref<Boolean>(false)
const sellersStore = useSellersStore()
const imagesStore = useImagesStore()
const { loading, storedSellers, winner, showDialog, totalPoints, loadingInvoice } = storeToRefs(useSellersStore())
const { loadingImgs } = storeToRefs(useImagesStore())

const getStarOffset = (points: number) => `${(points / 20) * 100}%`

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

onMounted(() => {
  if (!storedSellers.value.length) {
    getSellers()
  }
  loadingImages.value = true
  instructionsDialogVisible.value = true
})

const performSearch = async () => {
  if (searchQuery.value.trim().length) {
    await imagesStore.searchImages(searchQuery.value)
    loadingImages.value = loadingImgs.value
  } else {
    ElMessage({
      message: 'Please search for a valid product...',
      type: 'warning'
    })
  }
}

const getSellers = async () => {
  await sellersStore.getSellers()
}

const pointsController = (seller: Sellers, index: number) => {
  sellersStore.updateSellerPoints(index)
  loadingImages.value = loading.value
  searchQuery.value = ''
}

const resetPoints = () => {
  sellersStore.resetSellersPoints()
}
</script>


<template>
  <div class="search-component">
    <el-dialog v-model="instructionsDialogVisible" :z-index="4000">
      <div class="instructions-dialog-content">
        <p>Welcome to World Images!</p>
        <p>
          To start, please search for any product you want. Our sellers will show you their product options as images. You will choose the image you like the most from any seller, which will give the seller 3 points. A seller wins with 20 points.
        </p>
      </div>
      <template #footer>
        <el-button @click="instructionsDialogVisible = false">Got it!</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showDialog" :z-index="4000" @close="resetPoints()">
      <div
        v-loading="loadingInvoice"
        element-loading-text="Loading invoice..."
        class="dialog-content"
      >
        <span
          >Congratulations to <span class="winner">{{ winner.name }}</span> for reaching
          <span class="winner">20 points</span> first!</span
        >
        <p>
          Your total points prize is <span class="winner">{{ totalPoints }} points.</span>
        </p>
        <h3>INVOICE</h3>
        <div v-if="winner.invoice" class="invoice-content">
          <p><strong>Invoice ID:</strong> {{ winner.invoice.id }}</p>
          <p><strong>Date:</strong> {{ winner.invoice.date }}</p>
          <p><strong>Due Date:</strong> {{ winner.invoice.dueDate }}</p>
          <p><strong>Client:</strong> {{ winner.invoice.client.name }}</p>
          <p><strong>Total:</strong> {{ winner.invoice.total }}</p>
          <p><strong>Invoice status:</strong> {{ winner.invoice.status }}</p>
          <p><strong>Seller:</strong> {{ winner.invoice.seller.name }}</p>
          <p><strong>National Id:</strong> {{ winner.invoice.seller.identification }}</p>
          <div v-for="item in winner.invoice.items" :key="item.id">
            <p class="winner"><strong>Quantity sold:</strong> {{ item.quantity }}</p>
            <p><strong>Product:</strong> {{ item.name }}</p>
            <p><strong>Price per item:</strong> {{ formatCurrency(item.price) }}</p>
            <p><strong>Total:</strong> {{ formatCurrency(item.price * item.quantity) }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-input
      v-model="searchQuery"
      clearable
      placeholder="Search a product to start..."
      id="search-bar"
      class="search-bar custom-search-bar"
      @keyup.enter="performSearch"
    >
      <template #append>
        <el-button :icon="Search" @click="performSearch" id="search-button" class="custom-search-button" />
      </template>
    </el-input>
    <div class="card-container">
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in storedSellers"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="12"
          :lg="8"
          :xl="8"
          class="card-column"
        >
          <el-card class="card" shadow="hover">
            <div class="star-label">
              <svg class="star" viewBox="0 0 24 24">
                <defs>
                  <linearGradient :id="'grad-' + item.id" x1="0" x2="100%" y1="0" y2="0">
                    <stop :offset="getStarOffset(item.points)" stop-color="#ffffff" />
                    <stop :offset="getStarOffset(item.points)" stop-color="#00E0C7" />
                  </linearGradient>
                </defs>
                <path
                  :fill="'url(#grad-' + item.id + ')'"
                  stroke="#fff"
                  stroke-width="2"
                  d="M12 .587l3.668 7.431 8.207 1.174-5.938 5.775 1.404 8.191L12 18.902l-7.341 3.857 1.404-8.191-5.938-5.775 8.207-1.174z"
                />
              </svg>
            </div>
            <div v-loading="loadingImages" element-loading-text="Waiting for a new search">
              <img
                v-if="item.image.length && !loadingImages"
                :src="item.image"
                style="width: 100%; border-radius: 10px"
                @click="pointsController(item, index)"
              />
              <img
                v-else
                src="../assets/white.png"
                style="width: 100%; border-radius: 10px"
              />
              <el-text tag="b" type="info">{{ item.product }}</el-text>
            </div>
            <template #footer>
              <div class="card-footer">
                <div>
                  <el-text tag="b" size="large" class="seller-info">{{ item.name }}</el-text> <span class="seller-type">{{ `(${item.observations})` }}</span>
                </div>
                <div class="points-system">
                  <el-text tag="b" size="large" class="points-text">{{ item.points }} / 20</el-text>
                </div>
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>

.search-bar {
  width: 1080px;
  max-width: 1080px;
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 0 10px;
}

.top-sellers {
  margin-bottom: 15px;
}

.seller-type {
  color: #727b8e;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 20px;
}

.card-column {
  width: 100%;
}

.card {
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 340px;
  margin-bottom: 20px;
  border-radius: 15px;
  border: 0.5px solid #f5f0f0;
  background-color: #fff;
}

.card img {
  width: 100%;
  height: 308px;
  object-fit: scale-down;
  border-radius: 10px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.star-label {
  position: absolute;
  top: 0;
  right: 20px;
  background-color: #00e0c7;
  border-radius: 0 0 5px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 40px;
  z-index: 3000;
}

.star-label svg {
  width: 16px;
  height: 16px;
}

.seller-info {
  font-size: 16px;
  color: #11182a;
}

.points-system {
  display: flex;
  align-items: center;
}

.points-text {
  margin-left: 10px;
  font-size: 18px;
  color: #727b8e;
}

.winner {
  color: #11182a;
  font-weight: 700;
  font-size: 16px;
}

.invoice-content {
  margin-left: auto;
  margin-right: auto;
  max-width: 300px;
  text-align: start;
}

.invoice-content p {
  margin: 5px 0;
}

.invoice-details {
  margin-left: 20px;
}

.dialog-content {
  text-align: left;
  padding: 20px;
  text-align: center;
}

.dialog-content h3 {
  text-align: center;
  margin: 20px 0;
}

.dialog-content .item {
  margin-bottom: 10px;
}

.dialog-content .item p {
  margin: 0;
}

.reset-message {
  text-align: center;
  margin-top: 20px;
}

.dialog-footer {
  text-align: center;
}

.instructions-dialog-content {
  text-align: center;
  padding: 20px;
  color: #11182a;
}

.not-found {
  color: #112a1b;
  margin: auto;
}

@media (max-width: 1200px) {
  .search-bar {
    max-width: 900px;
  }
}

@media (max-width: 992px) {
  .search-bar {
    max-width: 700px;
  }
}

@media (max-width: 768px) {
  .search-bar {
    max-width: 500px;
  }
}

@media (max-width: 576px) {
  .search-bar {
    max-width: 340px;
  }
}
</style>

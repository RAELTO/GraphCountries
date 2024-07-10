<script setup lang="ts">
  import HomeView from '@/views/HomeView.vue';
</script>

<template>
    <div class="common-layout">
      <el-container>
        <el-header class="header">
          <div class="header-content">
            <img src="../assets/logo.png" alt="Logo" class="logo">
          </div>
        </el-header>
        <el-main class="main">
          <div class="main-content">
            <slot><HomeView /></slot>
          </div>
        </el-main>
      </el-container>
    </div>
</template>

<style scoped>
.header {
  background-color: #ffffff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.logo {
  height: 80px;
  margin-right: 20px;
}

.el-main {
  margin-top: 60px;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 600px);
  width: 100%;
}

.main-content {
  width: 100%;
  max-width: 1200px;
  padding: 80px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
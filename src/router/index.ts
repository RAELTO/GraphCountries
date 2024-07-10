import { createRouter, createWebHistory } from 'vue-router'
import CommonLayout from '@/layouts/CommonLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CommonLayout,
    },
  ]
})

export default router

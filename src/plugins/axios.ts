import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { App } from 'vue'


const axiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com',
  timeout: 10000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    ElMessage({
      message: error.message,
      type: 'error',
    })
    return Promise.reject(error)
  }
)

export default {
  install: (app: App) => {
    app.config.globalProperties.$axios = axiosInstance
  },
  axiosInstance,
}

export { axiosInstance }

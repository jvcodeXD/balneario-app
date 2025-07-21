import axios from 'axios'
import { useAuthStore, useLoadingStore } from '@/store'
import { refreshService } from '@/services/auth.service'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

// Interceptor de request: agrega token y activa loading
api.interceptors.request.use(config => {
  const authStore = useAuthStore()
  const loadingStore = useLoadingStore()

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  loadingStore.start()
  return config
})

// Interceptor de respuesta: maneja errores y refresh automático
api.interceptors.response.use(
  response => {
    const loadingStore = useLoadingStore()
    loadingStore.stop()
    return response
  },
  async error => {
    const loadingStore = useLoadingStore()
    loadingStore.stop()

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { accessToken, user } = await refreshService()
        const authStore = useAuthStore()
        authStore.login(accessToken, user)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        const authStore = useAuthStore()
        authStore.logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

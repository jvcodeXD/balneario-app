import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const loading = ref(false)
  let requests = 0

  const start = () => {
    requests++
    loading.value = true
  }

  const stop = () => {
    requests = Math.max(0, requests - 1)
    if (requests === 0) loading.value = false
  }

  return {
    loading,
    start,
    stop,
  }
})

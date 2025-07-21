import { reactive } from 'vue'
import { toast } from 'vue3-toastify'

interface ToastOptions {
  autoClose?: number
  hideProgressBar?: boolean
  closeOnClick?: boolean
  pauseOnHover?: boolean
  draggable?: boolean
  progress?: number
}

interface Toast {
  type: 'success' | 'warning' | 'error' | 'dark' | 'default' | 'info'
  message: string
  options?: ToastOptions
}

interface ToastState {
  toasts: Toast[]
}

const state = reactive<ToastState>({
  toasts: [],
})

export const useToastStore = () => {
  const addToast = (type: Toast['type'], message: string, options?: ToastOptions) => {
    state.toasts.push({ type, message, options })
  }

  const getToasts = (): Toast[] => {
    return state.toasts
  }

  const clearToasts = () => {
    state.toasts = []
  }

  const showPendingToasts = () => {
    state.toasts.forEach(({ type, message, options }) => {
      // @ts-ignore
      toast[type](message, options)
    })
    clearToasts()
  }

  return {
    addToast,
    getToasts,
    clearToasts,
    showPendingToasts,
  }
}

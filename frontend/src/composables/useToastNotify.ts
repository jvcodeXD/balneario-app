import { toast } from 'vue3-toastify'
import type { ToastOptions } from 'vue3-toastify'

export const useToastNotify = () => {
  const notify = {
    success: (msg: string, options?: ToastOptions) => toast.success(msg, options),
    error: (msg: string, options?: ToastOptions) => toast.error(msg, options),
    info: (msg: string, options?: ToastOptions) => toast.info(msg, options),
    warning: (msg: string, options?: ToastOptions) => toast.warning(msg, options),
    default: (msg: string, options?: ToastOptions) => toast(msg, options),
  }

  return notify
}

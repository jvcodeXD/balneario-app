import { ref } from 'vue'

type ConfirmDialogType = 'info' | 'warning' | 'error' | 'success' | 'confirm-only'

const dialog = ref(false)
const message = ref('')
const type = ref<ConfirmDialogType>('info')
let resolveFn: (value: boolean) => void

export const useConfirmDialog = () => {
  const show = (msg: string, dialogType: ConfirmDialogType = 'info'): Promise<boolean> => {
    message.value = msg
    type.value = dialogType
    dialog.value = true

    return new Promise(resolve => {
      resolveFn = resolve
    })
  }

  const confirm = () => {
    dialog.value = false
    resolveFn(true)
  }

  const cancel = () => {
    dialog.value = false
    resolveFn(false)
  }

  return {
    dialog,
    message,
    type,
    show,
    confirm,
    cancel,
  }
}

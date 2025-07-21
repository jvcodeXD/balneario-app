import { ref, computed } from 'vue'

export const usePasswordField = () => {
  const showPassword = ref(false)

  const type = computed(() => (showPassword.value ? 'text' : 'password'))
  const icon = computed(() => (showPassword.value ? 'mdi-eye-off' : 'mdi-eye'))

  const toggle = () => {
    showPassword.value = !showPassword.value
  }

  return {
    showPassword,
    type,
    icon,
    toggle,
  }
}

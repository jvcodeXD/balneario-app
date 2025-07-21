import { ref, watch } from 'vue'

export const useImageUpload = (defaultUrl: string = '/placeholder-user.png') => {
  const file = ref<File | null>(null)
  const previewUrl = ref<string>(defaultUrl)

  watch(file, newFile => {
    if (newFile) {
      previewUrl.value = URL.createObjectURL(newFile)
    } else {
      previewUrl.value = defaultUrl
    }
  })

  const reset = () => {
    file.value = null
    previewUrl.value = defaultUrl
  }

  return {
    file,
    previewUrl,
    reset,
  }
}

<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card>
      <v-card-title>Editar Usuario</v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" class="text-center">
              <v-avatar size="96">
                <v-img :src="previewUrl" />
              </v-avatar>
              <v-file-input
                v-model="pictureFile"
                accept="image/*"
                show-size
                label="Seleccionar imagen"
                prepend-icon="mdi-camera"
                class="mt-2"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="localUser.username"
                label="Usuario"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="localUser.password"
                :type="type"
                :append-inner-icon="icon"
                @click:append-inner="toggle"
                label="Contraseña (opcional)"
                :rules="[
                  v =>
                    !v || v.length >= 6 || 'Debe tener al menos 6 caracteres',
                ]"
                :required="false"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="localUser.fullname"
                label="Nombre completo"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="localUser.role"
                :items="['ADMIN', 'USER']"
                label="Rol"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" color="primary" @click="cancel"
          >Cancelar</v-btn
        >
        <v-btn variant="outlined" color="success" @click="submit"
          >Actualizar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { updateUser } from '@/services'
import { UsuarioInterface } from '@/interfaces'
import { usePasswordField, useImageUpload, useToastNotify } from '@/composables'
import { UserRole } from '@/dtos'

const { type, icon, toggle } = usePasswordField()

const props = defineProps<{
  modelValue: boolean
  user: UsuarioInterface
}>()

const emit = defineEmits(['update:modelValue', 'saved'])
const notify = useToastNotify()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const localUser = ref<Omit<UsuarioInterface, 'id'>>({
  username: '',
  fullname: '',
  role: UserRole.USER,
  picture: '',
  password: '',
})

const {
  file: pictureFile,
  previewUrl,
  reset,
} = useImageUpload(
  props.user?.picture
    ? `http://localhost:4000${props.user.picture}`
    : '/placeholder-user.png'
)

watch(
  () => props.user,
  user => {
    if (user) {
      const { password, ...rest } = user
      localUser.value = { ...rest, password: '' }
      previewUrl.value = user.picture
        ? `http://localhost:4000${user.picture}`
        : '/placeholder-user.png'
      pictureFile.value = null
    }
  },
  { immediate: true }
)

watch(pictureFile, file => {
  if (file) previewUrl.value = URL.createObjectURL(file)
})

const roleOptions = computed(() =>
  Object.values(UserRole).map(role => ({ text: role, value: role }))
)

const cancel = () => {
  isOpen.value = false
}

const submit = async () => {
  try {
    const formData = new FormData()
    formData.append('username', localUser.value.username)
    formData.append('fullName', localUser.value.fullname)
    formData.append('role', localUser.value.role)
    if (localUser.value.password?.trim()) {
      formData.append('password', localUser.value.password)
    }

    if (pictureFile.value) {
      formData.append('picture', pictureFile.value)
    }

    await updateUser(props.user.id, formData)
    notify.success('Usuario actualizado correctamente')
    emit('saved')
    isOpen.value = false
  } catch (error: any) {
    notify.error(error.message)
  }
}
</script>

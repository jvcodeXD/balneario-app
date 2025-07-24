<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card>
      <v-card-title>Crear Usuario</v-card-title>

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
                label="Contraseña"
                :rules="[
                  v =>
                    !v || v.length >= 6 || 'Debe tener al menos 6 caracteres',
                ]"
                :required="true"
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
                :items="tipoUsuarios"
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
        <v-btn variant="outlined" color="success" @click="submit">Crear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { createUser } from '@/services'
import { UsuarioInterface } from '@/interfaces'
import { usePasswordField, useImageUpload, useToastNotify } from '@/composables'
import { UserRole } from '@/dtos'

const { type, icon, toggle } = usePasswordField()

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'saved'])
const notify = useToastNotify()
const tipoUsuarios = Object.values(UserRole)

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const { file: pictureFile, previewUrl, reset } = useImageUpload()

const localUser = ref<Omit<UsuarioInterface, 'id'>>({
  username: '',
  fullname: '',
  role: UserRole.USER,
  picture: '',
  password: '',
})

watch(pictureFile, file => {
  if (file) previewUrl.value = URL.createObjectURL(file)
})

const cancel = () => {
  resetForm()
  isOpen.value = false
}

const resetForm = () => {
  localUser.value = {
    username: '',
    fullname: '',
    role: UserRole.USER,
    picture: '',
  }
  pictureFile.value = null
  previewUrl.value = '/placeholder-user.png'
}

const submit = async () => {
  try {
    const formData = new FormData()
    formData.append('username', localUser.value.username)
    formData.append('fullname', localUser.value.fullname)
    formData.append('role', localUser.value.role)
    formData.append('password', localUser.value.password!)

    if (pictureFile.value) {
      formData.append('picture', pictureFile.value)
    }

    await createUser(formData)
    notify.success('Usuario creado con éxito')
    emit('saved')
    cancel()
  } catch (error: any) {
    notify.error(error.message)
  }
}
</script>

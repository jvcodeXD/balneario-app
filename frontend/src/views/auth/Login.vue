<template>
  <v-container
    class="fill-height d-flex flex-column justify-center align-center text-center"
  >
    <v-card class="pa-8" elevation="8" max-width="400">
      <v-card-title class="text-h5 font-weight-bold mb-4"
        >Iniciar Sesión</v-card-title
      >

      <v-text-field label="Usuario" v-model="username" outlined dense />
      <v-text-field
        label="Contraseña"
        v-model="pass"
        type="password"
        outlined
        dense
      />

      <v-card-actions class="justify-end mt-4">
        <v-btn variant="outlined" color="error" @click="cancelar"
          >Cancelar</v-btn
        >
        <v-btn variant="outlined" color="primary" @click="login"
          >Ingresar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useToastStore } from '@/store'
import { loginService } from '@/services'
import { useToastNotify } from '@/composables'
import { AuthResponse } from '@/interfaces'
import { UserRole } from '@/dtos'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const notify = useToastNotify()
const username = ref('')
const pass = ref('')

const login = async () => {
  try {
    const response = (await loginService(
      username.value,
      pass.value
    )) as AuthResponse
    authStore.login(response.accessToken, response.user)
    console.log(authStore.user)

    toastStore.addToast('success', 'Inicio de sesión exitoso')

    if (response.user.role === UserRole.ADMIN) {
      router.push('admin-dashboard')
    } else {
      router.push('user-dashboard')
    }
  } catch (error) {
    notify.error('Usuario o contraseña incorrectos')
  }
}

const cancelar = () => {
  router.push({ name: 'Home' })
}
</script>

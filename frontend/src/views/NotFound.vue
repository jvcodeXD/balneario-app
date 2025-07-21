<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center text-center">
    <v-card class="pa-8" elevation="8" max-width="500">
      <v-card-title class="text-h4 mb-4"> Página No Encontrada </v-card-title>
      <v-card-text class="mb-6">
        <p>La ruta que intentaste acceder no existe.</p>
        <p>Puedes volver a tu panel principal.</p>
      </v-card-text>
      <v-btn color="primary" @click="goToDashboard"> Volver al Dashboard </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { UserRole } from '@/dtos'

const router = useRouter()
const authStore = useAuthStore()

const goToDashboard = () => {
  if (authStore.role === UserRole.ADMIN) {
    router.push({ name: 'AdminDashboard' })
  } else if (authStore.role === UserRole.USER) {
    router.push({ name: 'UserDashboard' })
  } else {
    router.push({ name: 'Home' })
  }
}
</script>

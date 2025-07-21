<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h4"> Bienvenido </v-card-title>
      <v-card-text>
        <p>Esta es la página de inicio pública.</p>
        <p>Si estás autenticado, serás redirigido automáticamente a tu panel.</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore, useToastStore } from '@/store'
import { UserRole } from '@/dtos'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

onMounted(() => {
  toastStore.showPendingToasts()
  if (authStore.isAuthenticated) {
    if (authStore.role === UserRole.ADMIN) {
      router.replace({ name: 'AdminDashboard' })
    } else if (authStore.role === UserRole.USER) {
      router.replace({ name: 'UserDashboard' })
    }
  }
})
</script>

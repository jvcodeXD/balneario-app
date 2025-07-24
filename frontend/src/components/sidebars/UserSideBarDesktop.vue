<template>
  <v-navigation-drawer
    app
    :permanent="true"
    :width="drawer ? 200 : 72"
    color="primary"
    dark
  >
    <SidebarProfile
      :name="authStore.user?.fullname || 'Usuario'"
      :picture="'http://localhost:4000' + authStore.user.picture"
      :showName="drawer"
    />

    <v-divider class="my-2" />

    <v-list dense nav>
      <v-list-item @click="navegar('Home')">
        <v-icon>mdi-home</v-icon>
        <v-list-item-title v-if="drawer">Home</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navegar('Venta')">
        <v-icon>mdi-cash</v-icon>
        <v-list-item-title v-if="drawer">Ventas</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navegar('ReporteUsuario')">
        <v-icon>mdi-chart-bar</v-icon>
        <v-list-item-title v-if="drawer">Reportes</v-list-item-title>
      </v-list-item>

      <v-list-item @click="logout">
        <v-icon>mdi-logout</v-icon>
        <v-list-item-title v-if="drawer">Cerrar Sesión</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-btn
      icon
      @click="emit('update:drawer', !drawer)"
      class="mt-auto mb-4 mx-auto"
      color="secondary"
    >
      <v-icon>{{ drawer ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
    </v-btn>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore, useToastStore } from '@/store'
import { logoutService } from '@/services'
import { useConfirmDialog, useToastNotify } from '@/composables'
import SidebarProfile from './SidebarProfile.vue'

const props = defineProps<{ drawer: boolean }>()
const emit = defineEmits(['update:drawer'])

const authStore = useAuthStore()
const toastStore = useToastStore()
const notify = useToastNotify()
const { show } = useConfirmDialog()
const router = useRouter()

const navegar = (ruta: string) => {
  router.push({ name: ruta })
}

const logout = async () => {
  const confirm = await show('¿Estás seguro de cerrar sesión?', 'info')
  if (!confirm) return
  await logoutService()
  toastStore.addToast('info', 'Sesión cerrada correctamente')
  authStore.logout()
  router.push({ name: 'Home' })
}
</script>

<template>
  <v-app-bar color="primary" dark app>
    <!-- Botón de menú tipo hamburguesa -->
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>

      <!-- Menú desplegable -->
      <v-list>
        <v-list-item @click="navegar('Home')">
          <v-icon start>mdi-home</v-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item @click="navegar('Venta')">
          <v-icon start>mdi-cash</v-icon>
          <v-list-item-title>Ventas</v-list-item-title>
        </v-list-item>

        <v-list-item @click="navegar('ReporteUsuario')">
          <v-icon start>mdi-chart-bar</v-icon>
          <v-list-item-title>Reportes</v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout">
          <v-icon start>mdi-logout</v-icon>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Título -->
    <v-toolbar-title>Usuario</v-toolbar-title>

    <v-spacer />

    <!-- Avatar -->
    <v-avatar size="32" v-if="authStore.user">
      <v-img :src="'http://localhost:4000' + authStore.user.picture" />
    </v-avatar>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore, useToastStore } from '@/store'
import { logoutService } from '@/services'
import { useConfirmDialog, useToastNotify } from '@/composables'

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

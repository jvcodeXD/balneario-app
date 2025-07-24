<template>
  <v-app-bar color="primary" dark app>
    <!-- Botón hamburguesa -->
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
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>

        <v-list-item @click="navegar('Users')">
          <v-icon start>mdi-account-multiple</v-icon>
          <v-list-item-title>Usuarios</v-list-item-title>
        </v-list-item>

        <v-list-item @click="navegar('Ambientes')">
          <v-icon start>mdi-office-building</v-icon>
          <v-list-item-title>Ambientes</v-list-item-title>
        </v-list-item>

        <v-list-item @click="navegar('Eventos')">
          <v-icon start>mdi-calendar-clock</v-icon>
          <v-list-item-title>Eventos</v-list-item-title>
        </v-list-item>

        <v-list-item @click="navegar('Precios')">
          <v-icon start>mdi-cash</v-icon>
          <v-list-item-title>Precios</v-list-item-title>
        </v-list-item>

        <v-list-item @click="navegar('Reportes')">
          <v-icon start>mdi-chart-bar</v-icon>
          <v-list-item-title>Reportes</v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout">
          <v-icon start>mdi-logout</v-icon>
          <v-list-item-title>Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Título -->
    <v-toolbar-title>Admin</v-toolbar-title>

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
import { useToastNotify, useConfirmDialog } from '@/composables'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const notify = useToastNotify()
const { show } = useConfirmDialog()

const navegar = (ruta: string) => {
  router.push({ name: ruta })
}

const logout = async () => {
  try {
    const confirm = await show('¿Estás seguro de cerrar sesión?', 'info')
    if (!confirm) return
    await logoutService()
    toastStore.addToast('info', 'Sesión cerrada correctamente')
    authStore.logout()
    router.push({ name: 'Home' })
  } catch (error) {
    notify.error('Error en logout')
  }
}
</script>

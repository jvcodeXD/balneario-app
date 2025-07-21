<template>
  <v-navigation-drawer
    app
    :permanent="true"
    :width="drawer ? 200 : 72"
    color="primary"
    dark
  >
    <v-list dense nav>
      <!-- Perfil -->
      <SidebarProfile
        :name="authStore.user?.fullname || 'Usuario'"
        :picture="'http://localhost:4000' + authStore.user.picture"
        :showName="drawer"
      />

      <v-divider class="my-2" />

      <!-- Navegación -->
      <v-list-item @click="goTo('Home')">
        <v-icon>mdi-home</v-icon>
        <v-list-item-title v-if="drawer"> Inicio </v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('Users')">
        <v-icon>mdi-account-multiple</v-icon>
        <v-list-item-title v-if="drawer"> Usuarios </v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('Ambientes')">
        <v-icon>mdi-office-building</v-icon>
        <v-list-item-title v-if="drawer">Ambientes</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('Eventos')">
        <v-icon>mdi-calendar-clock</v-icon>
        <v-list-item-title v-if="drawer">Eventos</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('Precios')">
        <v-icon>mdi-cash</v-icon>
        <v-list-item-title v-if="drawer">Precios</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('Reportes')">
        <v-icon>mdi-chart-bar</v-icon>
        <v-list-item-title v-if="drawer">Reportes</v-list-item-title>
      </v-list-item>

      <v-list-item @click="logout">
        <v-icon>mdi-logout</v-icon>
        <v-list-item-title v-if="drawer"> Cerrar Sesión </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Botón de colapso -->
    <v-btn
      icon
      @click="$emit('toggle-drawer')"
      class="mt-auto mb-4"
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
import { SidebarProfile } from '.'
import { useConfirmDialog, useToastNotify } from '@/composables'

const props = defineProps<{ drawer: boolean }>()
const emit = defineEmits(['toggle-drawer'])

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const notify = useToastNotify()

const goTo = (routeName: string) => {
  router.push({ name: routeName })
}

const { show } = useConfirmDialog()

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

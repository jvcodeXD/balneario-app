<template>
  <v-app>
    <!-- Botón de cambio de tema fijo -->
    <v-btn icon class="theme-toggle" @click="toggleTheme" color="primary" elevation="4">
      <v-icon size="24">
        {{ themeStore.currentTheme === 'light' ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
      </v-icon>
    </v-btn>

    <!-- Sidebar -->
    <SideBarSelector :drawer="drawer" @toggle-drawer="drawer = !drawer" />

    <!-- Contenido principal -->
    <v-main>
      <v-container>
        <router-view />
        <ConfirmDialog />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/store'
import { SideBarSelector, ConfirmDialog } from '@/components'

const drawer = ref(true)
const themeStore = useThemeStore()
const vuetifyTheme = useTheme()

const toggleTheme = () => {
  themeStore.toggleTheme()
}

// Siempre aplica el tema actual al montar o cambiar
watchEffect(() => {
  vuetifyTheme.global.name.value = themeStore.currentTheme
})
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  background-color: #212121 !important;
  color: white !important;
}
</style>

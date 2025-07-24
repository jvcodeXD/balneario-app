<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useAuthStore, useThemeStore } from '@/store'
import { SideBarSelector, ConfirmDialog } from '@/components'

const drawer = ref(true)

const vuetifyTheme = useTheme()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const {
  smAndDown, // celulares
  mdAndUp, // tablets + desktop
} = useDisplay()

const isMobile = computed(() => smAndDown.value)
const isDesktop = computed(() => mdAndUp.value)

const toggleTheme = () => {
  themeStore.toggleTheme()
}

watchEffect(() => {
  vuetifyTheme.global.name.value = themeStore.currentTheme
})
</script>

<template>
  <v-app>
    <!-- Botón cambio de tema -->
    <v-btn
      icon
      class="theme-toggle"
      @click="toggleTheme"
      color="primary"
      elevation="4"
    >
      <v-icon size="24">
        {{
          themeStore.currentTheme === 'light'
            ? 'mdi-weather-night'
            : 'mdi-white-balance-sunny'
        }}
      </v-icon>
    </v-btn>

    <!-- Sidebar dinámico según rol y dispositivo -->
    <SideBarSelector
      v-model:drawer="drawer"
      :is-mobile="isMobile"
      :is-desktop="isDesktop"
    />

    <!-- Contenido principal -->
    <v-main>
      <v-container>
        <router-view />
        <ConfirmDialog />
      </v-container>
    </v-main>
  </v-app>
</template>

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

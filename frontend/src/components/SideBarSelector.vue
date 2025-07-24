<template>
  <component
    :is="sidebarComponent"
    v-model:drawer="drawer"
    :is-mobile="isMobile"
    :is-desktop="isDesktop"
  />
</template>

<script setup lang="ts">
import {
  AdminSideBarDesktop,
  AdminMenuMobile,
  ClientSideBarDesktop,
  ClientMenuMobile,
  UserSideBarDesktop,
  UserMenuMobile,
  PublicSideBarDesktop,
  PublicMenuMobile,
} from './sidebars'

import { useAuthStore } from '@/store/auth'
import { computed } from 'vue'
import { UserRole } from '@/dtos'

const props = defineProps<{
  drawer: boolean
  isMobile: boolean
  isDesktop: boolean
}>()

const emit = defineEmits(['update:drawer'])

const authStore = useAuthStore()

// Enlace con v-model
const drawer = computed({
  get: () => props.drawer,
  set: val => emit('update:drawer', val),
})

const sidebarComponent = computed(() => {
  if (authStore.isAuthenticated) {
    switch (authStore.role) {
      case UserRole.ADMIN:
        return props.isMobile ? AdminMenuMobile : AdminSideBarDesktop
      case UserRole.USER:
        return props.isMobile ? UserMenuMobile : UserSideBarDesktop
      case UserRole.CLIENT:
        return props.isMobile ? ClientMenuMobile : ClientSideBarDesktop
    }
  }

  // Público
  return props.isMobile ? PublicMenuMobile : PublicSideBarDesktop
})
</script>

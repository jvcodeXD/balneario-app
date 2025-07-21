<template>
  <component :is="sidebarComponent" :drawer="drawer" @toggle-drawer="$emit('toggle-drawer')" />
</template>

<script setup lang="ts">
import { AdminSideBar, PublicSideBar, UserSideBar } from './sidebars'
import { useAuthStore } from '@/store/auth'
import { computed } from 'vue'
import { UserRole } from '@/dtos'

const props = defineProps<{ drawer: boolean }>()
const emit = defineEmits(['toggle-drawer'])

const authStore = useAuthStore()

const sidebarComponent = computed(() => {
  if (authStore.isAuthenticated) {
    if (authStore.role === UserRole.ADMIN) {
      return AdminSideBar
    } else if (authStore.role === UserRole.USER) {
      return UserSideBar
    }
  }
  return PublicSideBar
})
</script>

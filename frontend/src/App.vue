<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { DefaultLayout, AuthLayout, ErrorLayout } from '@/layouts'

const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta.layout
  if (layout === 'auth') return AuthLayout
  if (layout === 'error') return ErrorLayout
  return DefaultLayout
})
</script>

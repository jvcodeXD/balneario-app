<template>
  <v-progress-linear v-if="loading" color="primary" height="3" indeterminate absolute top />
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/store'
const { loading } = useLoadingStore()
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h4">Panel de Administración</v-card-title>
      <v-card-text>
        <p>Bienvenido, Admin. Aquí puedes gestionar usuarios, configuraciones y más.</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useToastStore } from '@/store'

const toastStore = useToastStore()

onMounted(() => {
  toastStore.showPendingToasts()
})
</script>

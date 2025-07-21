<template>
  <div class="flex items-center gap-1 p-1 justify-center">
    <!-- Mostrar solo el ícono y la hora -->
    <v-icon v-if="evento.icon" class="text-white">{{ evento.icon }}</v-icon>
    <small class="text-white">
      {{ formatFechaHora(evento.start, 'HH:MM') }} - {{ formatFechaHora(evento.end, 'HH:MM') }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { useDateFormat } from '@/composables'

defineProps<{
  evento: any
}>()

const { formatFechaHora } = useDateFormat()
</script>

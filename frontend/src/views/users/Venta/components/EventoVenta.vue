<template>
  <div
    class="evento-vuecal text-center d-flex justify-center"
    :class="`bg-${obtenerColorVisual(evento.estadoVisual, evento.tipo)}`"
  >
    <v-menu
      v-model="evento.menu"
      :close-on-content-click="false"
      location="end"
    >
      <template v-slot:activator="{ props }">
        <div
          class="flex items-center justify-center"
          v-bind="props"
          style="cursor: pointer"
        >
          <v-container>
            <v-row class="d-flex justify-center">
              <v-icon v-if="evento.estado" size="15">
                {{ obtenerIcono(evento.estado) }}
              </v-icon>
            </v-row>
            <v-row class="d-flex justify-center">
              <small>
                {{ formatFechaHora(evento.start, 'HH:MM') }} -
                {{ formatFechaHora(evento.end, 'HH:MM') }}
              </small>
            </v-row>
          </v-container>
        </div>
      </template>

      <EventoPopover :event="evento" @close="close" />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { useDateFormat, obtenerIcono, obtenerColorVisual } from '@/composables'
import EventoPopover from './EventoPopover.vue'

const props = defineProps<{
  evento: any
}>()
const emit = defineEmits<{
  (e: 'close', dato: null): void
}>()
const { formatFechaHora } = useDateFormat()

const close = () => {
  emit('close', null)
}
</script>
<style></style>

<template>
  <v-card class="elevation-2">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center gap-2">
        <v-icon color="deep-orange-darken-3">mdi-calendar-alert</v-icon>
        <span class="font-weight-bold text-truncate">{{ evento.nombre }}</span>
      </div>
      <v-chip
        :color="evento.tipo === 'DIARIO' ? 'blue-darken-2' : 'green-darken-2'"
        text-color="white"
        size="small"
        class="text-uppercase"
      >
        {{ evento.tipo }}
      </v-chip>
    </v-card-title>

    <v-card-subtitle class="px-4">
      {{ evento.descripcion || 'Sin descripción' }}
    </v-card-subtitle>

    <v-card-text class="px-4 pt-2 pb-3">
      <div class="text-subtitle-2 mb-1">
        <v-icon icon="mdi-clock-outline" size="18" class="mr-1" />
        {{ evento.hora_inicio }} - {{ evento.hora_fin }}
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="justify-end px-4 pb-3">
      <v-tooltip text="Editar" location="top">
        <template #activator="{ props }">
          <v-btn
            color="warning"
            size="small"
            variant="outlined"
            v-bind="props"
            @click="handleUpdate(evento.id)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Eliminar" location="top">
        <template #activator="{ props }">
          <v-btn
            color="red"
            variant="outlined"
            size="small"
            v-bind="props"
            @click="eliminar"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Ver detalle" location="top">
        <template #activator="{ props }">
          <v-btn
            color="blue"
            variant="outlined"
            size="small"
            v-bind="props"
            @click="verDetalle(evento)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-card-actions>
  </v-card>
  <EventoDetalles
    v-model="mostrarDetalle"
    :evento="eventoSeleccionado"
    @close="close"
  />
  <v-dialog v-model="updateDialog" max-width="600">
    <EditarEvento :id="selected" @close="handleUpdate()" />
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { EditarEvento, EventoDetalles } from '.'
import { EventoInterface } from '@/interfaces'
import { useConfirmDialog, useToastNotify } from '@/composables'
import { deleteEvento } from '@/services'

const props = defineProps<{ evento: EventoInterface }>()
const emit = defineEmits<{
  (e: 'close'): void
}>()
const { show } = useConfirmDialog()
const notify = useToastNotify()
const updateDialog = ref(false)
const selected = ref<string | null>(null)

const mostrarDetalle = ref(false)
const eventoSeleccionado = ref<EventoInterface | null>(null)

const close = () => {
  emit('close')
}

const verDetalle = (evento: EventoInterface) => {
  eventoSeleccionado.value = evento
  mostrarDetalle.value = true
}

const handleUpdate = async (id?: string) => {
  if (id) selected.value = id
  updateDialog.value = !updateDialog.value
  if (!updateDialog.value) {
    selected.value = null
    emit('close')
  }
}

const eliminar = async () => {
  try {
    const confirm = await show(
      'Estas seguro que deseas eliminar este evento?',
      'warning'
    )
    if (!confirm) return
    await deleteEvento(props.evento!.id)
    notify.info('Evento eliminado correctamente')
  } catch (error: any) {
    notify.error(error.message)
  } finally {
    emit('close')
  }
}
</script>

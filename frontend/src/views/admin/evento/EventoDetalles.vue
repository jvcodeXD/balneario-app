<template>
  <v-dialog v-model="visible" max-width="600">
    <v-card>
      <v-card-title class="bg-blue-grey-darken-2 text-white">
        <v-icon class="mr-2">mdi-calendar-text</v-icon>
        Detalle del Evento
      </v-card-title>

      <v-card-text class="pt-4">
        <v-row>
          <v-col cols="12" class="mb-2">
            <strong>Nombre:</strong> {{ evento?.nombre }}
          </v-col>

          <v-col cols="12">
            <strong>Descripción:</strong>
            <div class="text-body-2 text-grey-darken-1">
              {{ evento?.descripcion || 'Sin descripción' }}
            </div>
          </v-col>

          <v-col cols="6">
            <strong>Tipo:</strong>
            <v-chip
              :color="evento?.tipo === 'DIARIO' ? 'blue' : 'green'"
              size="small"
              class="ml-2"
            >
              {{ evento?.tipo }}
            </v-chip>
          </v-col>

          <v-col cols="6">
            <strong>Estado:</strong>
            <v-chip
              :color="evento?.activo ? 'green' : 'grey'"
              size="small"
              class="ml-2"
            >
              {{ evento?.activo ? 'Activo' : 'Inactivo' }}
            </v-chip>
          </v-col>

          <v-col cols="6">
            <strong>Hora inicio:</strong> {{ evento?.hora_inicio }}
          </v-col>
          <v-col cols="6">
            <strong>Hora fin:</strong> {{ evento?.hora_fin }}
          </v-col>

          <v-col cols="12" v-if="evento?.tipo === 'UNICO' && evento.fecha">
            <strong>Fecha única:</strong> {{ evento.fecha }}
          </v-col>

          <v-col cols="12">
            <strong>Ambientes afectados:</strong>
            <v-chip-group column class="mt-2">
              <v-chip
                v-for="amb in evento?.ambientes || []"
                :key="amb.id"
                :color="
                  amb.estado === 'HABILITADO'
                    ? 'green-lighten-3'
                    : 'red-lighten-3'
                "
                size="small"
                class="ma-1"
              >
                {{ amb.nombre }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="grey" variant="outlined" @click="cerrar">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { EventoInterface } from '@/interfaces'

const props = defineProps<{
  modelValue: boolean
  evento: EventoInterface | null
}>()

const emit = defineEmits(['update:modelValue', 'close'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => {
    visible.value = val
  }
)

const cerrar = () => {
  visible.value = false
  emit('update:modelValue', false)
}
</script>

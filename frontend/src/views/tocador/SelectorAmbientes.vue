<template>
  <div>
    <v-row v-for="(grupo, tipo) in ambientesPorTipo" :key="tipo">
      <v-col cols="12">
        <v-card flat class="pa-3">
          <div class="d-flex align-center justify-space-between">
            <strong class="text-uppercase">{{ tipo }}</strong>
            <v-btn
              size="small"
              variant="outlined"
              color="indigo"
              @click="toggleSeleccionTipo(tipo, grupo)"
            >
              Seleccionar todos
            </v-btn>
          </div>

          <v-row>
            <v-col
              v-for="ambiente in grupo"
              :key="ambiente.id"
              cols="12"
              sm="auto"
              md="auto"
            >
              <v-checkbox
                v-model="model"
                :value="ambiente.id"
                :label="ambiente.nombre"
                color="indigo"
                density="compact"
                hide-details
                class="mini-checkbox"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AmbienteInterface } from '@/interfaces'
import { useAmbientesStore } from '@/store'

const props = defineProps<{ ambientes: AmbienteInterface[] }>()

const store = useAmbientesStore()

// 🔗 Sin emit: el modelo va directo al store
const model = computed<string[]>({
  get: () => store.seleccionados,
  set: val => store.setSeleccionados(val),
})

const ambientesPorTipo = computed(() => {
  const grupos: Record<string, AmbienteInterface[]> = {}
  for (const amb of props.ambientes) {
    if (!grupos[amb.tipo]) grupos[amb.tipo] = []
    grupos[amb.tipo].push(amb)
  }
  return grupos
})

const toggleSeleccionTipo = (tipo: string, grupo: AmbienteInterface[]) => {
  const idsGrupo = grupo.map(g => g.id)
  const yaSeleccionados = idsGrupo.every(id => model.value.includes(id))
  model.value = yaSeleccionados
    ? model.value.filter(id => !idsGrupo.includes(id))
    : Array.from(new Set([...model.value, ...idsGrupo]))
}
</script>

<style scoped>
.mini-checkbox {
  font-size: 10px;
  --v-input-padding-top: 2px;
  --v-input-padding-bottom: 2px;
}

.mini-checkbox .v-selection-control {
  min-height: 32px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.mini-checkbox .v-label {
  font-size: 12px !important;
}
</style>

<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title class="text-h6">
      <v-icon class="mr-2">mdi-calendar-plus</v-icon>
      Crear nuevo evento
    </v-card-title>

    <v-card-text>
      <v-row>
        <!-- Nombre evento -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formEvento.nombre"
            variant="outlined"
            label="Nombre del evento"
            placeholder="Ingrese el nombre del evento"
          />
        </v-col>

        <!-- Tipo de evento -->
        <v-col cols="12" md="6">
          <v-select
            v-model="formEvento.tipo"
            :items="tiposEvento"
            label="Tipo de evento"
            item-title="text"
            item-value="value"
            variant="outlined"
            placeholder="Seleccione el tipo de evento"
          />
        </v-col>
      </v-row>

      <v-row v-if="formEvento.tipo === TipoEvento.UNICO">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="fecha"
            :active="menuFecha"
            label="Fecha de inicio"
            prepend-inner-icon="mdi-calendar"
            color="success"
            readonly
            variant="outlined"
          >
            <v-menu
              v-model="menuFecha"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-date-picker v-model="formEvento.fecha" color="success" />
            </v-menu>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formEvento.hora_inicio"
            label="Hora de inicio"
            placeholder="00:00"
            prepend-inner-icon="mdi-clock"
            variant="outlined"
            :active="menuHoraInicio"
          >
            <v-menu
              v-model="menuHoraInicio"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-time-picker
                v-model="formEvento.hora_inicio"
                scrollable
                format="24hr"
                color="success"
                class="time-picker-sm"
                @update:hour="
                  (val: any) => actualizarHora(val, 'HORA', 'INICIO')
                "
                @update:minute="
                  (val: any) => actualizarHora(val, 'MINUTO', 'INICIO')
                "
              />
            </v-menu>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formEvento.hora_fin"
            label="Hora final"
            placeholder="00:00"
            prepend-inner-icon="mdi-clock"
            variant="outlined"
            :active="menuHoraFin"
          >
            <v-menu
              v-model="menuHoraFin"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-time-picker
                v-model="formEvento.hora_fin"
                scrollable
                format="24hr"
                color="warning"
                class="time-picker-sm"
                @update:hour="(val: any) => actualizarHora(val, 'HORA', 'FIN')"
                @update:minute="
                  (val: any) => actualizarHora(val, 'MINUTO', 'FIN')
                "
              />
            </v-menu>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Descripcion -->
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="formEvento.descripcion"
            label="Descripción"
            placeholder="Descripción del evento"
            variant="outlined"
            rows="2"
            auto-grow
            hide-details
            class="text-sm"
          />
        </v-col>
      </v-row>

      <!-- Ambientes -->
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
                  v-model="formEvento.ambientes"
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
    </v-card-text>
    <v-card-actions class="d-flex justify-space-evenly">
      <v-btn variant="outlined" color="red" @click="close">Cancelar</v-btn>
      <v-btn variant="outlined" color="green" @click="crearEvento"
        >Aceptar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useDateFormat, useToastNotify } from '@/composables'
import { TipoEvento } from '@/dtos'
import { AmbienteInterface, CrearEventoInterface } from '@/interfaces'
import { createEvento, getAmbientes } from '@/services'
import { format } from 'date-fns'
import { ref, onMounted, computed, reactive } from 'vue'

const emit = defineEmits(['close'])

const notify = useToastNotify()
const { formatFechaHora } = useDateFormat()

const tiposEvento = Object.entries(TipoEvento).map(([key, value]) => ({
  text: value,
  value: key,
}))

const formEvento = reactive<CrearEventoInterface>({
  nombre: '',
  descripcion: '',
  tipo: TipoEvento.DIARIO,
  fecha: new Date(),
  hora_inicio: formatFechaHora(new Date(), 'HH:MM'),
  hora_fin: formatFechaHora(new Date(), 'HH:MM'),
  ambientes: [],
})

const fecha = ref(format(formEvento.fecha!, 'yyyy-MM-dd'))
const ambientes = ref<AmbienteInterface[]>([])
const menuHoraInicio = ref(false)
const menuHoraFin = ref(false)
const menuFecha = ref(false)

const ambientesPorTipo = computed(() => {
  const grupos: Record<string, AmbienteInterface[]> = {}
  for (const amb of ambientes.value) {
    if (!grupos[amb.tipo]) grupos[amb.tipo] = []
    grupos[amb.tipo].push(amb)
  }
  return grupos
})

const obtenerAmbientes = async () => {
  try {
    ambientes.value = await getAmbientes()
  } catch (error: any) {
    notify.error(error.message)
  }
}

const actualizarHora = (val: any, tipo: string, selected: string) => {
  const pad = (n: any) => String(n).padStart(2, '0')
  if (selected === 'INICIO') {
    const [hora, minuto] = formEvento.hora_inicio.split(':')
    formEvento.hora_inicio =
      tipo === 'HORA'
        ? `${pad(val)}:${pad(minuto)}`
        : `${pad(hora)}:${pad(val)}`
  } else {
    const [hora, minuto] = formEvento.hora_fin.split(':')
    formEvento.hora_fin =
      tipo === 'HORA'
        ? `${pad(val)}:${pad(minuto)}`
        : `${pad(hora)}:${pad(val)}`
  }

  // Cerrar menú al seleccionar minuto
  if (tipo === 'MINUTO') {
    selected === 'INICIO'
      ? (menuHoraInicio.value = false)
      : (menuHoraFin.value = false)
  }
  // calcularDiferencia()
}

const toggleSeleccionTipo = (tipo: string, grupo: AmbienteInterface[]) => {
  const idsGrupo = grupo.map(g => g.id)
  const yaSeleccionados = idsGrupo.every(id =>
    formEvento.ambientes.includes(id!)
  )

  if (yaSeleccionados) {
    // Desmarcar todos
    formEvento.ambientes = formEvento.ambientes.filter(
      id => !idsGrupo.includes(id)
    )
  } else {
    // Agregar los que faltan
    formEvento.ambientes = [
      ...new Set([...formEvento.ambientes, ...idsGrupo]),
    ].filter((id): id is string => typeof id === 'string')
  }
}

const crearEvento = async () => {
  try {
    if (formEvento.tipo === TipoEvento.DIARIO) formEvento.fecha = null
    await createEvento(formEvento)
    notify.success('Evento creado exitosamente')
    close()
  } catch (error: any) {
    notify.error(error.message)
  }
}

const close = () => {
  emit('close')
}

onMounted(obtenerAmbientes)
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

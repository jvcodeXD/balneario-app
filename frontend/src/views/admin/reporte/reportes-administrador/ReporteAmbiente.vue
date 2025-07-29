<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h6 font-weight-bold">
        Reporte de Uso de Ambientes
      </v-card-title>

      <v-divider class="my-4" />

      <!-- Filtros de fecha -->
      <v-row>
        <!-- Fecha inicio -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="fechaInicioFormatted"
            label="Fecha Inicio"
            prepend-inner-icon="mdi-calendar"
            readonly
            variant="outlined"
          >
            <v-menu
              v-model="menuFechaInicio"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-date-picker
                v-model="form.fecha_inicio"
                color="success"
                @update:model-value="obtenerReporte"
              />
            </v-menu>
          </v-text-field>
        </v-col>

        <!-- Fecha fin -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="fechaFinFormatted"
            label="Fecha Fin"
            prepend-inner-icon="mdi-calendar"
            readonly
            variant="outlined"
          >
            <v-menu
              v-model="menuFechaFin"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-date-picker
                v-model="form.fecha_fin"
                color="success"
                @update:model-value="obtenerReporte"
              />
            </v-menu>
          </v-text-field>
        </v-col>

        <!-- Botón de imprimir (ajustado) -->
        <v-col cols="12" md="4" class="d-flex">
          <v-btn variant="outlined" color="blue" @click="handleImprimir">
            <v-icon>mdi-printer</v-icon>
            Imprimir
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- Tabla de resultados -->
      <v-table dense>
        <thead>
          <tr>
            <th>Ambiente</th>
            <th>Tipo</th>
            <th>Usos</th>
            <th>Horas</th>
            <th>Total Generado (Bs)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="amb in ambientes" :key="amb.id">
            <td>{{ amb.nombre }}</td>
            <td>{{ amb.tipo }}</td>
            <td>{{ amb.uso }}</td>
            <td>{{ Number(amb.horas_uso).toFixed(2) }}</td>
            <td>{{ Number(amb.total_generado).toFixed(2) }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-divider class="my-6" />

      <h3 class="text-subtitle-1 font-weight-bold mb-2">Resumen General</h3>

      <v-table dense>
        <thead>
          <tr>
            <th>Total Ambientes Usados</th>
            <th>Total Horas de Uso</th>
            <th>Total Generado (Bs)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ Number(resumen.uso) }}</td>
            <td>{{ Number(resumen.horas_uso).toFixed(2) }}</td>
            <td>{{ Number(resumen.total_generado).toFixed(2) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <!-- Renderizar componente de impresión -->
    <ReporteAmbientePDF
      v-if="imprimir"
      :fecha_inicio="inicio"
      :fecha_fin="fin"
      :ambientes="ambientes"
      @close="imprimir = false"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { startOfDay, endOfDay, format } from 'date-fns'
import { useToastNotify } from '@/composables'
import { reporteAmbientes } from '@/services'
import { AmbienteReporte } from '@/interfaces'
import { ReporteAmbientePDF } from '.'

const ambientes = ref<AmbienteReporte[]>([])
const notify = useToastNotify()
const imprimir = ref(false)

const handleImprimir = () => {
  imprimir.value = true
}

const fechaAnterior = () => {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - 6)
  return fecha
}

const form = reactive({
  fecha_inicio: fechaAnterior(),
  fecha_fin: new Date(),
})

const fechaInicioFormatted = computed(() =>
  format(form.fecha_inicio, 'yyyy-MM-dd')
)
const fechaFinFormatted = computed(() => format(form.fecha_fin, 'yyyy-MM-dd'))

const menuFechaInicio = ref(false)
const menuFechaFin = ref(false)

const inicio = computed(() => startOfDay(form.fecha_inicio))
const fin = computed(() => endOfDay(form.fecha_fin))

const obtenerReporte = async () => {
  try {
    ambientes.value = await reporteAmbientes({
      fecha_inicio: inicio.value,
      fecha_fin: fin.value,
    })
  } catch (error: any) {
    notify.error(error.message)
  }
}

const resumen = computed(() => {
  return ambientes.value.reduce(
    (acc, amb) => {
      acc.uso += Number(amb.uso)
      acc.horas_uso += Number(amb.horas_uso)
      acc.total_generado += Number(amb.total_generado)
      return acc
    },
    { uso: 0, horas_uso: 0, total_generado: 0 }
  )
})

onMounted(() => {
  obtenerReporte()
})
</script>

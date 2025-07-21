<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h5 font-weight-bold">
        Reportes Administrativos
      </v-card-title>

      <v-divider class="my-4" />

      <!-- Gráfico al centro -->
      <div class="d-flex justify-center mb-8">
        <GraficoVenta style="max-width: 800px; width: 100%" />
      </div>

      <!-- Sección de selección por tarjetas -->
      <v-row dense justify="center">
        <v-col
          v-for="item in opciones"
          :key="item.value"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            :elevation="opcionSeleccionada === item.value ? 8 : 2"
            :color="opcionSeleccionada === item.value ? 'primary' : ''"
            class="pa-4 d-flex flex-column align-center justify-center hoverable"
            @click="opcionSeleccionada = item.value"
          >
            <v-icon size="48" class="mb-2">
              {{ item.icon }}
            </v-icon>
            <div class="text-h6 font-weight-bold text-center">
              {{ item.label }}
            </div>
            <div class="text-caption text-center">
              {{ item.descripcion }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <!-- Contenido dinámico del reporte seleccionado -->
      <component :is="componenteActual" v-if="componenteActual" />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ReporteUsuario,
  ReporteAmbiente,
  ReporteTipoVenta,
  ReporteFinanciero,
  ReporteFechas,
  ReporteHorarios,
  ReporteMantenimiento,
} from './reportes-administrador'
import { GraficoVenta } from './graficos'

const opcionSeleccionada = ref('')

const opciones = [
  {
    label: 'Por Usuario',
    value: 'usuario',
    icon: 'mdi-account',
    descripcion: 'Resumen de ventas por usuario.',
  },
  {
    label: 'Por Ambiente',
    value: 'ambiente',
    icon: 'mdi-home-city',
    descripcion: 'Ventas agrupadas por ambiente.',
  },
  {
    label: 'Por Tipo de Venta',
    value: 'tipoVenta',
    icon: 'mdi-tag-multiple',
    descripcion: 'Comparación según tipo de venta.',
  },
  {
    label: 'Financiero',
    value: 'financiero',
    icon: 'mdi-cash-multiple',
    descripcion: 'Resumen total de ingresos y egresos.',
  },
  {
    label: 'Por Fechas',
    value: 'fechas',
    icon: 'mdi-calendar-range',
    descripcion: 'Reporte detallado por fechas.',
  },
  {
    label: 'Por Horarios',
    value: 'horarios',
    icon: 'mdi-clock-outline',
    descripcion: 'Análisis de horarios de uso.',
  },
  {
    label: 'Mantenimiento',
    value: 'mantenimiento',
    icon: 'mdi-tools',
    descripcion: 'Historial de mantenimiento.',
  },
]

const componenteActual = computed(() => {
  switch (opcionSeleccionada.value) {
    case 'usuario':
      return ReporteUsuario
    case 'ambiente':
      return ReporteAmbiente
    case 'tipoVenta':
      return ReporteTipoVenta
    case 'financiero':
      return ReporteFinanciero
    case 'fechas':
      return ReporteFechas
    case 'horarios':
      return ReporteHorarios
    case 'mantenimiento':
      return ReporteMantenimiento
    default:
      return null
  }
})
</script>

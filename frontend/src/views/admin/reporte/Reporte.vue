<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h5 font-weight-bold">
        Reportes Administrativos
      </v-card-title>

      <v-divider class="my-4" />

      <!-- Tabs de navegación -->
      <v-tabs v-model="tabSeleccionada" background-color="transparent" grow>
        <v-tab v-for="item in opciones" :key="item.value">
          <v-icon start>{{ item.icon }}</v-icon>
          {{ item.label }}
        </v-tab>
      </v-tabs>

      <v-divider class="my-4" />

      <!-- Contenido del tab -->
      <v-window v-model="tabSeleccionada">
        <!-- Pestaña: Gráfico principal -->
        <v-window-item value="grafico">
          <div class="d-flex justify-center mb-8">
            <GraficoVenta style="max-width: 800px; width: 100%" />
          </div>
        </v-window-item>

        <!-- Resto de pestañas dinámicas -->
        <v-window-item
          v-for="item in opciones.slice(1)"
          :key="item.value"
          :value="item.value"
        >
          <component :is="componenteActual(item.value)" />
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ReporteUsuario,
  ReporteAmbiente,
  ReporteTipoVenta,
  ReporteFinanciero,
  ReporteUso,
  ReporteEventos,
} from './reportes-administrador'
import { GraficoVenta } from './graficos'

const tabSeleccionada = ref('grafico')

const opciones = [
  {
    label: 'Resumen Ventas',
    value: 'grafico',
    icon: 'mdi-chart-bar',
    descripcion: 'Gráfico general de ventas por tipo de ambiente.',
  },
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
    descripcion: 'Uso individual por ambiente físico.',
  },
  {
    label: 'Por Tipo de Venta',
    value: 'tipoVenta',
    icon: 'mdi-tag-multiple',
    descripcion: 'Comparación según tipo de venta.',
  },
  {
    label: 'Por Uso',
    value: 'uso',
    icon: 'mdi-calendar-clock',
    descripcion: 'Distribución de ventas por fecha y horario.',
  },
  {
    label: 'Eventos Programados',
    value: 'eventos',
    icon: 'mdi-calendar-check',
    descripcion: 'Eventos registrados en un rango de fechas.',
  },
  {
    label: 'Ingresos Financieros',
    value: 'financiero',
    icon: 'mdi-cash-multiple',
    descripcion: 'Resumen total de ingresos por fechas.',
  },
]

const componenteActual = (valor: string) => {
  switch (valor) {
    case 'usuario':
      return ReporteUsuario
    case 'ambiente':
      return ReporteAmbiente
    case 'tipoVenta':
      return ReporteTipoVenta
    case 'uso': // ← nuevo componente combinado
      return ReporteUso
    case 'eventos':
      return ReporteEventos
    case 'financiero':
      return ReporteFinanciero
    default:
      return null
  }
}
</script>

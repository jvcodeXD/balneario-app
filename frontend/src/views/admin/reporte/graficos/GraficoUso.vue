<template>
  <v-card class="pa-4">
    <v-card-title class="text-h6 font-weight-bold">
      Ventas por Hora (rango de fechas)
    </v-card-title>

    <v-card-text>
      <v-row dense class="mb-4">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="fechaInicioFormatted"
            label="Fecha Inicio"
            prepend-inner-icon="mdi-calendar"
            readonly
            variant="outlined"
          >
            <v-menu
              v-model="menuInicio"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-date-picker
                v-model="fechaInicio"
                @update:model-value="actualizarFechas"
              />
            </v-menu>
          </v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="fechaFinFormatted"
            label="Fecha Fin"
            prepend-inner-icon="mdi-calendar"
            readonly
            variant="outlined"
          >
            <v-menu
              v-model="menuFin"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-date-picker
                v-model="fechaFin"
                @update:model-value="actualizarFechas"
              />
            </v-menu>
          </v-text-field>
        </v-col>
      </v-row>

      <div ref="chartRef" style="width: 100%; height: 750px"></div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { startOfDay, endOfDay, format } from 'date-fns'
import * as echarts from 'echarts'
import { useToastNotify } from '@/composables'
import { reporteUso } from '@/services'

const notify = useToastNotify()

const ahora = new Date()
const fechaInicio = ref(
  new Date(startOfDay(ahora.setDate(ahora.getDate() - 6)))
)
const fechaFin = ref(new Date(endOfDay(new Date())))

const fechaInicioFormatted = ref(format(fechaInicio.value, 'yyyy-MM-dd'))
const fechaFinFormatted = ref(format(fechaFin.value, 'yyyy-MM-dd'))

const menuInicio = ref(false)
const menuFin = ref(false)
const chartRef = ref<HTMLElement | null>(null)

const datosVentas = ref<any[]>([])

const actualizarFechas = () => {
  fechaInicioFormatted.value = format(fechaInicio.value, 'yyyy-MM-dd')
  fechaFinFormatted.value = format(fechaFin.value, 'yyyy-MM-dd')
  cargarDatos()
}

const cargarDatos = async () => {
  try {
    datosVentas.value = await reporteUso({
      fecha_inicio: fechaInicio.value,
      fecha_fin: fechaFin.value,
    })
    nextTick(() => renderChart())
  } catch (error: any) {
    notify.error('Error al obtener datos')
  }
}

const renderChart = () => {
  if (!chartRef.value) return

  const chart = echarts.init(chartRef.value)
  chart.clear()

  const horas = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, '0')}:00`
  )

  const fechasUnicas = [...new Set(datosVentas.value.map(item => item.fecha))]

  const series: echarts.EChartsOption['series'] = fechasUnicas.map(
    (fecha, index) => {
      // 🔸 Mapa hora → cantidad
      const ventasPorHora = new Map(
        datosVentas.value
          .filter(item => item.fecha === fecha)
          .map(item => [item.hora.slice(0, 5), parseInt(item.cantidad)])
      )

      // 🔸 Asegura que todas las horas existan, usando 0 si no hay dato
      const puntos = horas.map(hora => ({
        value: hora,
        symbolSize: (ventasPorHora.get(hora) || 0) * 3,
      }))

      return {
        type: 'scatter',
        coordinateSystem: 'singleAxis',
        name: fecha,
        data: puntos,
        singleAxisIndex: index,
      }
    }
  )

  const option: echarts.EChartsOption = {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `Fecha: <b>${params.seriesName}</b><br>Hora: <b>${params.value}</b><br>Ventas: <b>${params.data.symbolSize / 3}</b>`
      },
    },
    singleAxis: fechasUnicas.map((fecha, index) => ({
      left: 100,
      top: 50 + index * 60,
      height: 50,
      type: 'category',
      boundaryGap: false,
      data: horas,
      name: fecha,
      nameLocation: 'start',
    })),
    series,
  }

  chart.setOption(option)
}

onMounted(() => {
  cargarDatos()
})
</script>

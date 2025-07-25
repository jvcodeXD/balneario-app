<template>
  <v-card class="pa-4">
    <v-card-title class="text-h6 font-weight-bold">
      Porcentaje de ingresos por tipo de ambiente
    </v-card-title>

    <v-card-text>
      <!-- Filtros de fechas -->
      <v-row dense class="mb-4 align-center">
        <v-col cols="12" md="3">
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
                v-model="fechaInicio"
                color="success"
                @update:model-value="actualizarFechas"
              />
            </v-menu>
          </v-text-field>
        </v-col>

        <v-col cols="12" md="3">
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
                v-model="fechaFin"
                color="success"
                @update:model-value="actualizarFechas"
              />
            </v-menu>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Gráfico -->
      <div ref="chartRef" style="height: 400px; width: 100%" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useToastNotify } from '@/composables'
import { reporteVentasTipoAmbiente } from '@/services'
import { format, startOfDay, endOfDay } from 'date-fns'
import { TipoAmbiente } from '@/interfaces'

const notify = useToastNotify()

// Fechas
const ahora = new Date()
const fechaInicio = ref(
  new Date(startOfDay(ahora.setDate(ahora.getDate() - 7)))
)
const fechaFin = ref(new Date(endOfDay(new Date())))

const fechaInicioFormatted = ref(format(fechaInicio.value, 'yyyy-MM-dd'))
const fechaFinFormatted = ref(format(fechaFin.value, 'yyyy-MM-dd'))

const menuFechaInicio = ref(false)
const menuFechaFin = ref(false)

const datos = ref<Record<string, { tipo: TipoAmbiente; total: number }[]>>({})
const tiposAmbiente = Object.values(TipoAmbiente)
const chartRef = ref<HTMLElement | null>(null)

// Actualiza los campos visibles y gráfico
const actualizarFechas = () => {
  fechaInicioFormatted.value = format(fechaInicio.value, 'yyyy-MM-dd')
  fechaFinFormatted.value = format(fechaFin.value, 'yyyy-MM-dd')
  actualizarGrafico()
}

const obtenerVentas = async () => {
  if (fechaInicio.value > fechaFin.value) {
    notify.error('La fecha de inicio no puede ser mayor que la fecha de fin.')
    return
  }

  try {
    datos.value = await reporteVentasTipoAmbiente({
      fecha_inicio: fechaInicio.value,
      fecha_fin: fechaFin.value,
    })
  } catch (error: any) {
    notify.error(error)
  }
}

const procesarDatosParaGrafico = (
  datos: Record<string, { tipo: TipoAmbiente; total: number }[]>
) => {
  const fechas = Object.keys(datos).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  const seriesData: Record<TipoAmbiente, number[]> = {
    SAUNA: [],
    SAUNA_MIXTO: [],
    INDIVIDUAL: [],
    FAMILIAR: [],
  }

  const seriesDataReales: Record<TipoAmbiente, number[]> = {
    SAUNA: [],
    SAUNA_MIXTO: [],
    INDIVIDUAL: [],
    FAMILIAR: [],
  }

  fechas.forEach(fecha => {
    const totales = datos[fecha]
    const totalDia = totales.reduce((sum, t) => sum + t.total, 0)

    tiposAmbiente.forEach(tipo => {
      const item = totales.find(t => t.tipo === tipo)
      const valorReal = item ? item.total : 0
      const porcentaje = totalDia ? valorReal / totalDia : 0

      seriesData[tipo].push(Number(porcentaje.toFixed(4)))
      seriesDataReales[tipo].push(valorReal)
    })
  })

  return {
    fechas: fechas.map(f => new Date(f).toLocaleDateString()),
    seriesData,
    seriesDataReales,
  }
}

const configurarGrafico = (
  fechas: string[],
  seriesData: Record<string, number[]>,
  seriesDataReales: Record<string, number[]>
) => {
  if (!chartRef.value) return
  const chart = echarts.init(chartRef.value)
  chart.clear()

  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const diaIndex = params[0].dataIndex
        let totalReal = 0

        tiposAmbiente.forEach(tipo => {
          totalReal += seriesDataReales[tipo][diaIndex] || 0
        })

        let tooltip = `<b>${params[0].axisValue}</b><br/>`
        tiposAmbiente.forEach(tipo => {
          const valorReal = seriesDataReales[tipo][diaIndex] || 0
          const porcentaje = totalReal ? (valorReal / totalReal) * 100 : 0

          tooltip += `${tipo}: ${valorReal.toFixed(0)} Bs (${porcentaje.toFixed(1)}%)<br/>`
        })

        return tooltip
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: fechas,
      axisLabel: { rotate: 30 },
    },
    yAxis: {
      type: 'value',
      max: 1,
      axisLabel: {
        formatter: (v: number) => `${(v * 100).toFixed(0)}%`,
      },
    },
    series: tiposAmbiente.map(tipo => ({
      name: tipo,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      label: {
        show: true,
        formatter: ({ value }: any) => `${(value * 100).toFixed(0)}%`,
      },
      data: seriesData[tipo],
    })),
  })
}

const actualizarGrafico = async () => {
  await obtenerVentas()
  const { fechas, seriesData, seriesDataReales } = procesarDatosParaGrafico(
    datos.value
  )
  nextTick(() => configurarGrafico(fechas, seriesData, seriesDataReales))
}

onMounted(() => {
  actualizarFechas()
  actualizarGrafico()
})
</script>

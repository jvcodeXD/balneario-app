<template>
  <v-container>
    <!-- Selector de tipo -->
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="tipoSeleccionado"
          :items="tiposAmbiente"
          label="Filtrar por tipo de ambiente"
          item-title="label"
          item-value="value"
          variant="outlined"
          class="mb-4"
        />
      </v-col>
    </v-row>

    <!-- Cards -->
    <v-row>
      <v-col
        v-for="venta in ventasFiltradas"
        :key="venta.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          :color="getColor(venta.minutosRestantes)"
          class="text-black"
          elevation="2"
        >
          <v-card-title class="text-h6 d-flex align-center">
            <v-icon class="me-2">{{ getIcono(venta.ambiente.tipo) }}</v-icon>
            {{ venta.ambiente.nombre }}
            <v-chip small label class="ml-auto">
              {{ venta.ambiente.tipo }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <div>
              <strong>Cliente:</strong> {{ venta.nombre_cliente || 'N/A' }}
            </div>
            <div>
              <strong>Inicio:</strong> {{ formatTime(venta.hora_inicio) }}
            </div>
            <div><strong>Fin:</strong> {{ formatTime(venta.hora_fin) }}</div>
            <div><strong>Faltan:</strong> {{ venta.minutosRestantes }} min</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getVentasRango } from '@/services'
import { TipoAmbiente } from '@/interfaces'
import { useToastNotify } from '@/composables'

const ventas = ref<any[]>([])
const tipoSeleccionado = ref<TipoAmbiente | null>(null)

const tiposAmbiente = [
  { label: 'TODOS', value: null, icon: '' },
  { label: TipoAmbiente.SAUNA, value: TipoAmbiente.SAUNA, icon: 'mdi-sauna' },
  {
    label: TipoAmbiente.INDIVIDUAL,
    value: TipoAmbiente.INDIVIDUAL,
    icon: 'mdi-account',
  },
  {
    label: TipoAmbiente.FAMILIAR,
    value: TipoAmbiente.FAMILIAR,
    icon: 'mdi-account-group',
  },
]

const notify = useToastNotify()

const obtenerVentas = async () => {
  try {
    const ahora = new Date()
    const fin = new Date(ahora.getTime() + 2 * 60 * 60 * 1000)

    const data = await getVentasRango(ahora.toISOString(), fin.toISOString())

    ventas.value = data.map(venta => {
      const horaFin = new Date(venta.hora_fin)
      const minutosRestantes = Math.ceil(
        (horaFin.getTime() - ahora.getTime()) / 60000
      )
      return { ...venta, minutosRestantes }
    })
  } catch (error) {
    notify.error('Error al obtener ventas')
  }
}

const ventasFiltradas = computed(() => {
  let lista = [...ventas.value]
  const tipo = tipoSeleccionado.value

  if (tipo) {
    lista = lista.filter(v => v.ambiente.tipo === tipo)
  }

  return lista.sort((a, b) => a.minutosRestantes - b.minutosRestantes)
})

const getColor = (minutos: number) => {
  if (minutos <= 10) return '#ffdddd' // rojo claro
  if (minutos <= 20) return '#fff4cc' // amarillo claro
  return '#e6ffe6' // verde muy suave
}

const getIcono = (tipo: TipoAmbiente) => {
  switch (tipo) {
    case TipoAmbiente.SAUNA:
      return 'mdi-hot-tub'
    case TipoAmbiente.INDIVIDUAL:
      return 'mdi-account'
    case TipoAmbiente.FAMILIAR:
      return 'mdi-account-group'
    default:
      return 'mdi-help-circle'
  }
}

const formatTime = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 🔄 Carga inicial y actualización automática cada minuto
onMounted(async () => {
  await obtenerVentas()
  setInterval(obtenerVentas, 60_000)
})
</script>

<template>
  <v-card>
    <!-- CABECERA -->
    <v-card-title>
      <v-row class="d-flex justify-center">
        <v-col cols="auto">
          <p class="text-h5 text-decoration-underline">REPORTE DE VENTAS</p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-space-between">
        <v-col cols="auto">
          <p class="text-subtitle-1">
            <strong>Usuario: </strong>{{ usuario?.fullname }}
          </p>
        </v-col>
        <v-col cols="auto">
          <p class="text-subtitle-1">
            {{ mostrarRangoFechas() }}
          </p>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <!-- POR CADA AMBIENTE -->
      <div v-for="(ventas, tipo) in ventasPorTipo" :key="tipo" class="mb-6">
        <h3 class="text-subtitle-1 font-weight-bold">{{ tipo }}</h3>

        <v-table dense>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th
                v-if="
                  tipo === TipoAmbiente.INDIVIDUAL ||
                  tipo === TipoAmbiente.SAUNA_MIXTO
                "
              >
                Cantidad
              </th>
              <th>Tipo de Venta</th>
              <th v-if="tipo !== TipoAmbiente.SAUNA_MIXTO">Adelanto</th>
              <th>Total</th>
              <th>Recibido</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="venta in ventas" :key="venta.id">
              <td>
                {{ format(new Date(venta.created_at!), 'yyyy-MM-dd HH:mm') }}
              </td>

              <td>
                <!-- Mostrar la fecha -->
                <div
                  v-if="venta.ambiente?.tipo !== TipoAmbiente.SAUNA_MIXTO"
                  class="font-weight-bold"
                >
                  {{ format(new Date(venta.hora_inicio), 'yyyy-MM-dd') }}
                </div>

                <!-- Mostrar las horas -->
                <div>
                  {{ format(new Date(venta.hora_inicio), 'HH:mm') }}
                  <span
                    v-if="venta.ambiente?.tipo !== TipoAmbiente.SAUNA_MIXTO"
                  >
                    - {{ format(new Date(venta.hora_fin), 'HH:mm') }}
                  </span>
                </div>
              </td>

              <td
                v-if="
                  tipo === TipoAmbiente.INDIVIDUAL ||
                  tipo === TipoAmbiente.SAUNA_MIXTO
                "
              >
                <template v-if="tipo === TipoAmbiente.SAUNA_MIXTO">
                  {{ venta.cantidad ?? 1 }} ({{
                    venta.ambiente?.nombre === 'PISCINA NIÑOS'
                      ? 'Niños'
                      : 'Adultos'
                  }})
                </template>
                <template v-else>
                  {{ venta.cantidad ?? 1 }}
                </template>
              </td>

              <td>
                <v-chip
                  :color="colorVenta(venta)"
                  variant="outlined"
                  size="small"
                >
                  {{ textoVenta(venta) }}
                </v-chip>
              </td>

              <td v-if="tipo !== TipoAmbiente.SAUNA_MIXTO">
                {{ Number(venta.adelanto) ?? 0 }} Bs.
              </td>
              <td>{{ Number(venta.precio_total) }} Bs.</td>
              <td>{{ recibidoVenta(venta).toFixed(2) }} Bs.</td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td colspan="7" class="text-right font-weight-bold">
                TOTAL {{ tipo }}: {{ calcularTotalPorAmbiente(ventas) }} Bs.
              </td>
            </tr>
          </tfoot>
        </v-table>
      </div>

      <v-divider class="my-4" />

      <!-- TOTAL GENERAL -->
      <v-row justify="end">
        <v-col cols="auto">
          <h3 class="text-h6 font-weight-bold">TOTAL GENERAL</h3>
          <p>VENTA INMEDIATA: {{ totalInmediata }} Bs.</p>
          <p>RESERVAS: {{ totalReserva }} Bs.</p>
          <p>RESTANTE: {{ totalRestante }} Bs.</p>
          <p class="text-error">CANCELADAS: {{ totalCanceladas }} Bs.</p>
          <p class="font-weight-bold">TOTAL: {{ totalGeneral }} Bs.</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { format } from 'date-fns'
import {
  TipoAmbiente,
  UsuarioInterface,
  VentaInterface,
  VentaTipo,
} from '@/interfaces'
import { TipoReporteUsuario } from '@/dtos'
import { reporteDiarioUsuario } from '@/services'
import { useToastNotify } from '@/composables'

const loading = ref(false)
const notify = useToastNotify()
const usuario = ref<UsuarioInterface | null>(null)
const ventas = ref<VentaInterface[]>([])

// NUEVOS PROPS
const props = defineProps<{
  usuario_id: string
  fechaInicio: Date
  fechaFin: Date
}>()

// Mostrar encabezado del rango de fechas
const mostrarRangoFechas = () => {
  return `${format(props.fechaInicio, 'yyyy-MM-dd')} al ${format(props.fechaFin, 'yyyy-MM-dd')}`
}

const obtenerReporte = async () => {
  try {
    loading.value = true
    const reporte = await reporteDiarioUsuario({
      usuario_id: props.usuario_id,
      fecha_inicio: props.fechaInicio,
      fecha_fin: props.fechaFin,
    })
    usuario.value = reporte.usuario
    ventas.value = reporte.ventas
    loading.value = false
    console.log(usuario.value, ventas.value)
  } catch (error: any) {
    notify.error(error.message)
    loading.value = false
  }
}

// Agrupamos por tipo de ambiente
const ventasPorTipo = computed(() => {
  const agrupado: Record<string, VentaInterface[]> = {}
  ventas.value.forEach(venta => {
    const tipo = venta.ambiente!.tipo
    if (!agrupado[tipo]) agrupado[tipo] = []
    agrupado[tipo].push(venta)
  })
  Object.keys(agrupado).forEach(tipo => {
    agrupado[tipo].sort(
      (a, b) =>
        new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
    )
  })

  return agrupado
})

// Helpers visuales
const textoVenta = (venta: VentaInterface) => {
  if (venta.tipo === VentaTipo.CANCELADA) return 'Reservación Cancelada'
  if (venta.tipo === VentaTipo.RESERVADA || venta.tipo === VentaTipo.FINALIZADA)
    return 'Reservación'
  if (venta.tipo === VentaTipo.RESTANTE) return 'Pago Restante'
  return 'INMEDIATA'
}

const colorVenta = (venta: VentaInterface) => {
  if (venta.tipo === VentaTipo.CANCELADA) return 'error'
  if (venta.tipo === VentaTipo.RESERVADA || venta.tipo === VentaTipo.FINALIZADA)
    return 'warning'
  if (venta.tipo === VentaTipo.RESTANTE) return 'success'
  return 'primary'
}

// Calcula el dinero recibido por cada venta
const recibidoVenta = (venta: VentaInterface) => {
  if (venta.tipo === VentaTipo.CANCELADA) return -(Number(venta.adelanto) ?? 0)
  if (venta.tipo === VentaTipo.RESERVADA || venta.tipo === VentaTipo.FINALIZADA)
    return Number(venta.adelanto) ?? 0
  if (venta.tipo === VentaTipo.RESTANTE)
    return Number(venta.precio_total) - Number(venta.adelanto)
  return Number(venta.precio_total)
}

// Total por ambiente
const calcularTotalPorAmbiente = (ventas: VentaInterface[]) => {
  return ventas.reduce((acc, venta) => acc + recibidoVenta(venta), 0).toFixed(2)
}

// Totales generales
const totalInmediata = computed(() =>
  ventas.value
    .filter(v => v.tipo === VentaTipo.INMEDIATA)
    .reduce((acc, v) => acc + recibidoVenta(v), 0)
    .toFixed(2)
)

const totalReserva = computed(() =>
  ventas.value
    .filter(
      v => v.tipo === VentaTipo.RESERVADA || v.tipo === VentaTipo.FINALIZADA
    )
    .reduce((acc, v) => acc + recibidoVenta(v), 0)
    .toFixed(2)
)

const totalRestante = computed(() =>
  ventas.value
    .filter(v => v.tipo === VentaTipo.RESTANTE)
    .reduce((acc, v) => acc + recibidoVenta(v), 0)
    .toFixed(2)
)

const totalCanceladas = computed(() =>
  ventas.value
    .filter(v => v.tipo === VentaTipo.CANCELADA)
    .reduce((acc, v) => acc + recibidoVenta(v), 0)
    .toFixed(2)
)

const totalGeneral = computed(() =>
  ventas.value.reduce((acc, v) => acc + recibidoVenta(v), 0).toFixed(2)
)

watch(
  () => [props.usuario_id, props.fechaInicio, props.fechaFin],
  async () => {
    await obtenerReporte()
  },
  { immediate: true }
)

onMounted(async () => {
  await obtenerReporte()
})
</script>

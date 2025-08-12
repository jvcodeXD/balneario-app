<template>
  <v-container>
    <div class="d-flex justify-end mb-3">
      <v-btn color="indigo" variant="outlined" @click="abrirDialogo">
        Filtrar ambientes ({{ store.seleccionados.length || 'todos' }})
      </v-btn>
    </div>

    <!-- Diálogo de filtro -->
    <v-dialog v-model="dialog" max-width="780">
      <v-card>
        <v-card-title class="text-h6">Seleccionar ambientes</v-card-title>
        <v-card-text>
          <!-- Tu componente de checkboxes por tipo -->
          <SelectorAmbientes :ambientes="ambientesDisponibles" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="cancelarDialogo">Cancelar</v-btn>
          <v-btn color="indigo" @click="aplicarDialogo">Aplicar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Cards -->
    <v-row>
      <v-col
        v-for="venta in ventasFiltradas"
        :key="venta.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card :color="getColor(venta)" class="text-black" elevation="2">
          <v-card-title class="text-h6 d-flex align-center">
            <v-icon class="me-2">{{ getIcono(venta.ambiente.tipo) }}</v-icon>
            {{ venta.ambiente.nombre }}
            <v-chip small label class="ml-auto">{{
              venta.ambiente.tipo
            }}</v-chip>
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
            <div>
              <strong>Estado:</strong>
              <v-chip
                :color="
                  venta.estado === EstadoVenta.FINALIZADA ? 'green' : 'orange'
                "
                dark
              >
                {{ venta.estado }}
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              v-if="venta.estado === EstadoVenta.PENDIENTE"
              color="blue"
              size="small"
              class="mt-2"
              @click="marcarIngreso(venta)"
            >
              Marcar ingreso
            </v-btn>

            <v-btn
              v-if="venta.estado === EstadoVenta.EN_USO"
              color="success"
              size="small"
              class="mt-2"
              @click="marcarComoFinalizado(venta)"
            >
              Finalizar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { actualizarEstadoVenta, getAmbientes, getVentasRango } from '@/services'
import { TipoAmbiente } from '@/interfaces'
import { useToastNotify } from '@/composables'
import { EstadoVenta } from '@/dtos'
import { SelectorAmbientes } from '../tocador'
import { useAmbientesStore } from '@/store'

// 🔹 Datos y store
const ventas = ref<any[]>([])
const notify = useToastNotify()
const store = useAmbientesStore()

// Si ya tienes esta lista en otra parte, pásala por prop; aquí asumo que la tienes disponible:
const ambientesDisponibles = ref<any[]>([]) // [{ id, nombre, tipo, ... }]

// 🗓️ Carga de ventas
const obtenerVentas = async () => {
  try {
    const ahora = new Date()
    const inicio = new Date(ahora.getTime() - 60 * 60 * 1000)
    const fin = new Date(ahora.getTime() + 60 * 60 * 1000)

    const data = await getVentasRango(inicio.toISOString(), fin.toISOString())

    ventas.value = data.map((venta: any) => {
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

// ✅ Filtrado por ambientes seleccionados en el store
const ventasFiltradas = computed(() => {
  const ids = store.seleccionados
  let lista = [...ventas.value]
  if (ids.length > 0) {
    lista = lista.filter(v => ids.includes(v.ambiente.id))
  }
  return lista.sort((a, b) => a.minutosRestantes - b.minutosRestantes)
})

// 🎨 Helpers UI
const getColor = (venta: any) => {
  if (venta.estado === EstadoVenta.PENDIENTE) return '#cce5ff' // Azul claro
  if (venta.estado === EstadoVenta.FINALIZADA) return '#e2e3e5' // Gris claro

  // Solo aplica a EN_USO
  if (venta.minutosRestantes <= 10) return '#f8d7da' // Rojo claro
  if (venta.minutosRestantes <= 20) return '#fff3cd' // Amarillo claro
  return '#d4edda' // Verde suave
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

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// 🔘 Acciones
const marcarComoFinalizado = async (venta: any) => {
  try {
    await actualizarEstadoVenta(venta.id, EstadoVenta.FINALIZADA)
    venta.estado = EstadoVenta.FINALIZADA
    notify.success('Venta finalizada')
    await obtenerVentas()
  } catch {
    notify.error('No se pudo finalizar la venta')
  }
}

const obtenerAmbientes = async () => {
  try {
    ambientesDisponibles.value = await getAmbientes()
  } catch (error) {
    notify.error('Error al obtener ambientes')
  }
}

const marcarIngreso = async (venta: any) => {
  try {
    await actualizarEstadoVenta(venta.id, EstadoVenta.EN_USO)
    venta.estado = EstadoVenta.EN_USO
    notify.success('Ingreso marcado')
    await obtenerVentas()
  } catch {
    notify.error('No se pudo marcar el ingreso')
  }
}

// 🔄 Auto-refresh
let intervalId: any = null
onMounted(async () => {
  await obtenerVentas()
  await obtenerAmbientes()
  intervalId = setInterval(obtenerVentas, 60_000)
})
onBeforeUnmount(() => intervalId && clearInterval(intervalId))

// 🪟 Diálogo de filtro
const dialog = ref(false)
let backupSeleccion: string[] = []

const abrirDialogo = () => {
  backupSeleccion = [...store.seleccionados] // respaldo para cancelar
  dialog.value = true
}
const cancelarDialogo = () => {
  store.setSeleccionados(backupSeleccion) // restaurar selección previa
  dialog.value = false
}
const aplicarDialogo = () => {
  dialog.value = false // ya está guardado en el store
}
</script>

<template>
  <Loader :visible="loading" />
  <v-card class="py-6">
    <v-card-title>
      <h2 class="text-h5 font-weight-bold text-center mb-6">
        Generar Reporte de Ventas
      </h2>
    </v-card-title>

    <v-card-text>
      <!-- Selector de tipo de reporte -->
      <v-row class="mb-4">
        <v-radio-group v-model="form.modo" inline>
          <v-radio
            v-for="tipo in tiposReporte"
            :label="tipo.text"
            :value="tipo.value"
          />
        </v-radio-group>
      </v-row>

      <!-- Filtros según el tipo de reporte -->
      <v-row>
        <!-- Diario -->
        <v-col v-if="form.modo === TipoReporteUsuario.DIARIO" cols="12" md="3">
          <v-text-field
            v-model="fechaInicioFormatted"
            :active="menuFechaInicio"
            label="Fecha"
            prepend-inner-icon="mdi-calendar"
            color="success"
            readonly
            variant="outlined"
          >
            <v-menu
              v-model="menuFechaInicio"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-date-picker v-model="form.fecha_inicio" color="success" />
            </v-menu>
          </v-text-field>
        </v-col>

        <!-- Mensual -->
        <v-col v-if="form.modo === TipoReporteUsuario.MENSUAL" cols="12" md="3">
          <v-text-field
            v-model="mesAnioFormatted"
            label="Mes y Año"
            prepend-inner-icon="mdi-calendar"
            color="success"
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
                view="month"
              />
            </v-menu>
          </v-text-field>
        </v-col>

        <!-- Rango -->
        <v-col v-if="form.modo === TipoReporteUsuario.RANGO" cols="12" md="3">
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
              <v-date-picker v-model="form.fecha_inicio" color="success" />
            </v-menu>
          </v-text-field>
        </v-col>

        <v-col v-if="form.modo === TipoReporteUsuario.RANGO" cols="12" md="3">
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
              <v-date-picker v-model="form.fecha_fin" color="success" />
            </v-menu>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Botón de buscar -->
      <v-row class="my-4">
        <v-col cols="auto">
          <v-btn
            color="primary"
            prepend-icon="mdi-magnify"
            @click="obtenerReporte"
          >
            Generar Reporte
          </v-btn>
        </v-col>
      </v-row>

      <!-- Mostramos el reporte -->
      <v-container v-if="usuario">
        <ReporteVentas
          :usuario="usuario"
          :ventas="ventas"
          :fechaInicio="form.fecha_inicio"
          :fechaFin="form.fecha_fin"
          :modo="form.modo"
        />
      </v-container>

      <!-- Botón PDF -->
      <div class="text-center my-4">
        <v-btn
          color="primary"
          @click="generarPDF"
          prepend-icon="mdi-file-pdf-box"
        >
          Imprimir PDF
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
  <ImprimirReporte
    v-if="mostrarVistaPDF"
    :usuario_id="form.usuario_id"
    :fecha_inicio="inicio"
    :fecha_fin="fin"
    @close="mostrarVistaPDF = false"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from 'date-fns'
import { Loader } from '@/components'
import { useAuthStore } from '@/store'
import { reporteDiarioUsuario } from '@/services'
import { useToastNotify } from '@/composables'
import { ReporteVentas } from '.'
import { VentaInterface, UsuarioInterface } from '@/interfaces'
import { TipoReporteUsuario } from '@/dtos'
import { ImprimirReporte } from '.'

const auth = useAuthStore()
const notify = useToastNotify()

// Tipos de reporte
const tiposReporte = [
  { text: 'Diario', value: 'DIARIO' },
  { text: 'Mensual', value: 'MENSUAL' },
  { text: 'Rango', value: 'RANGO' },
  { text: 'Total', value: 'TOTAL' },
]

// Estado
const form = reactive({
  modo: TipoReporteUsuario.DIARIO,
  fecha_inicio: new Date(),
  fecha_fin: new Date(),
  usuario_id: auth.user.id,
})

const usuario = ref<UsuarioInterface | null>(null)
const ventas = ref<VentaInterface[]>([])
const mostrarVistaPDF = ref(false)

const loading = ref(false)
const menuFechaInicio = ref(false)
const menuFechaFin = ref(false)
const inicio = ref<any>('')
const fin = ref<any>('')

// Formatos de fechas
const fechaInicioFormatted = computed(() =>
  format(form.fecha_inicio, 'yyyy-MM-dd')
)
const fechaFinFormatted = computed(() => format(form.fecha_fin, 'yyyy-MM-dd'))
const mesAnioFormatted = computed(() => format(form.fecha_inicio, 'MMMM yyyy'))

const obtenerReporte = async () => {
  try {
    loading.value = true
    switch (form.modo) {
      case TipoReporteUsuario.DIARIO:
        inicio.value = startOfDay(form.fecha_inicio)
        fin.value = endOfDay(form.fecha_inicio)
        break
      case TipoReporteUsuario.RANGO:
        inicio.value = startOfDay(form.fecha_inicio)
        fin.value = endOfDay(form.fecha_fin)
        break
      case TipoReporteUsuario.MENSUAL:
        inicio.value = startOfMonth(form.fecha_inicio)
        fin.value = endOfMonth(form.fecha_inicio)
        break
      default:
        inicio.value = startOfDay(new Date('2025-01-01'))
        fin.value = endOfDay(form.fecha_fin)
    }
    const reporte = await reporteDiarioUsuario({
      ...form,
      fecha_inicio: inicio.value,
      fecha_fin: fin.value,
    })

    usuario.value = reporte.usuario
    ventas.value = reporte.ventas
    loading.value = false
  } catch (error: any) {
    notify.error(error.message)
    loading.value = false
  }
}

const generarPDF = () => {
  mostrarVistaPDF.value = true
}
</script>

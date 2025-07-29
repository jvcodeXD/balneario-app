<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h6 font-weight-bold">
        Reporte de Ventas por Usuario
      </v-card-title>

      <v-divider class="my-4" />

      <!-- Filtros de fechas -->
      <v-row>
        <!-- Fecha inicio -->
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
                v-model="form.fecha_inicio"
                color="success"
                @update:model-value="obtenerReporte"
              />
            </v-menu>
          </v-text-field>
        </v-col>

        <!-- Fecha fin -->
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
                v-model="form.fecha_fin"
                color="success"
                @update:model-value="obtenerReporte"
              />
            </v-menu>
          </v-text-field>
        </v-col>

        <!-- Usuarios -->
        <v-col cols="12" md="4">
          <v-select
            v-model="usuarioSeleccionado"
            :items="usuarios"
            label="Filtrar por Usuario"
            item-title="fullname"
            item-value="id"
            variant="outlined"
            clearable
          />
        </v-col>

        <!-- Boton imprimir -->
        <v-col cols="12" md="2">
          <v-btn variant="outlined" color="blue" @click="handleImprimir">
            <v-icon>mdi-printer</v-icon>
            Imprimir
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <div v-if="!usuarioSeleccionado">
        <!-- Tabla general -->
        <v-table dense>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Cantidad Ventas</th>
              <th>Total Ventas (Bs)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in ventasOrdenadas" :key="v.fecha + v.usuario_id">
              <td>{{ new Date(v.fecha).toLocaleDateString() }}</td>
              <td>{{ v.fullname }}</td>
              <td>{{ v.cantidad_ventas }}</td>
              <td>{{ v.total_ventas }}</td>
            </tr>
          </tbody>
        </v-table>

        <v-divider class="my-6" />

        <h3 class="text-subtitle-1 font-weight-bold mb-2">Resumen General</h3>

        <v-table dense>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Cantidad Ventas</th>
              <th>Total Ventas (Bs)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in resumenGeneral" :key="usuario.usuario_id">
              <td>{{ usuario.fullname }}</td>
              <td>{{ usuario.cantidad_ventas }}</td>
              <td>{{ usuario.total_ventas }} Bs.</td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div v-else>
        <ReporteUsuarioTabla
          :usuario_id="usuarioSeleccionado"
          :fechaInicio="inicio"
          :fechaFin="fin"
        />
      </div>
    </v-card>
    <!-- Mostramos el reporte -->
    <v-container v-if="imprimir">
      <ImprimirReporte
        v-if="usuarioSeleccionado"
        :usuario_id="usuarioSeleccionado"
        :fecha_inicio="inicio"
        :fecha_fin="fin"
        @close="imprimir = false"
      />
      <ReportePDF
        v-else
        :fecha_inicio="inicio"
        :fecha_fin="fin"
        @close="imprimir = false"
      />
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { reporteIngresoUsuarios } from '@/services'
import { useToastNotify } from '@/composables'
import { format, startOfDay, endOfDay } from 'date-fns'
import { ReportePDF } from '.'
import { UsuarioInterface } from '@/interfaces'
import { getUsersByRole } from '@/services'
import { UserRole } from '@/dtos'
import { ReporteUsuarioTabla } from '.'
import ImprimirReporte from '@/views/users/Reporte/ImprimirReporte.vue'

interface VentaUsuario {
  fecha: string
  usuario_id: string
  fullname: string
  total_ventas: number
  cantidad_ventas: number
}

const notify = useToastNotify()
const ventas = ref<VentaUsuario[]>([])
const imprimir = ref(false)
const usuarios = ref<Array<UsuarioInterface>>([])
const usuarioSeleccionado = ref<string | null>(null)

const obtenerUsuarios = async () => {
  try {
    const data = await getUsersByRole(UserRole.USER)
    usuarios.value = [
      {
        id: null,
        fullname: 'Mostrar todos',
        role: UserRole.USER,
        username: '',
        picture: '',
      },
      ...data,
    ]
  } catch (error) {
    notify.error('Error al obtener usuarios')
  }
}

const handleImprimir = () => {
  imprimir.value = !imprimir.value
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

const inicio = computed(() => startOfDay(form.fecha_inicio))
const fin = computed(() => endOfDay(form.fecha_fin))
const fechaInicioFormatted = computed(() =>
  format(form.fecha_inicio, 'yyyy-MM-dd')
)
const fechaFinFormatted = computed(() => format(form.fecha_fin, 'yyyy-MM-dd'))
const menuFechaInicio = ref(false)
const menuFechaFin = ref(false)

const ventasOrdenadas = computed(() =>
  [...ventas.value].sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime()
    const fechaB = new Date(b.fecha).getTime()
    if (fechaA !== fechaB) return fechaA - fechaB
    return b.total_ventas - a.total_ventas
  })
)

const resumenGeneral = computed(() => {
  const resumen: Record<
    string,
    {
      usuario_id: string
      fullname: string
      total_ventas: number
      cantidad_ventas: number
    }
  > = {}

  ventas.value.forEach(v => {
    if (!resumen[v.usuario_id]) {
      resumen[v.usuario_id] = {
        usuario_id: v.usuario_id,
        fullname: v.fullname,
        total_ventas: 0,
        cantidad_ventas: 0,
      }
    }
    resumen[v.usuario_id].total_ventas += v.total_ventas
    resumen[v.usuario_id].cantidad_ventas += v.cantidad_ventas
  })

  return Object.values(resumen).sort((a, b) => b.total_ventas - a.total_ventas)
})

const obtenerReporte = async () => {
  try {
    const res = await reporteIngresoUsuarios({
      fecha_inicio: inicio.value,
      fecha_fin: fin.value,
    })
    ventas.value = res
  } catch (error: any) {
    notify.error(error.message)
  }
}

onMounted(async () => {
  await obtenerUsuarios()
  await obtenerReporte()
})
</script>

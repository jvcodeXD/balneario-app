<template>
  <div style="width: 600px; margin: 0 auto">
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <v-btn icon @click="cambiarDia(-1)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-col>

      <v-col class="text-center" cols="auto">
        <span class="text-h6">
          {{
            new Date(fecha)
              .toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              .replace(/^./, c => c.toUpperCase())
          }}
        </span>
      </v-col>

      <v-col cols="auto">
        <v-btn icon @click="cambiarDia(1)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <div class="d-flex justify-center pa-6">
      <v-card
        class="pa-4"
        style="width: 70%; max-width: 800px"
        elevation="8"
        rounded="xl"
      >
        <template v-slot:title>
          <span class="text-h5 font-weight-bold text-center d-block">
            Ventas Realizadas
          </span>
        </template>

        <v-divider class="my-3"></v-divider>

        <div class="text-subtitle-1 px-4">
          <v-row class="mb-2" align="center">
            <v-col cols="6" class="text-center text-h6">
              <v-icon>mdi-human-child</v-icon>
              <strong>Niños:</strong>
            </v-col>
            <v-col cols="6" class="text-center text-h6">
              <v-icon>mdi-human-male</v-icon>
              <strong>Adultos:</strong>
            </v-col>
          </v-row>
          <v-row class="mb-2" align="center">
            <v-col cols="6" class="text-center pl-8 text-h6">
              {{ menores }}
            </v-col>
            <v-col cols="6" class="text-center pr-8 text-h6">
              {{ mayores }}
            </v-col>
          </v-row>
        </div>

        <template v-slot:actions>
          <v-spacer></v-spacer>
          <CrearVentaPiscina tipo="SAUNA_MIXTO" @close="close" />
        </template>
      </v-card>
    </div>
    <ImprimirReciboPiscina
      v-if="mostrarRecibo && datos"
      v-model="mostrarRecibo"
      :datos="datos"
      @close="close"
    />

    <v-expansion-panels
      v-if="eventos.length > 0"
      multiple
      elevation="2"
      class="mx-2"
    >
      <v-expansion-panel class="mb-2 my-3" rounded="lg">
        <v-expansion-panel-title>
          <h3 class="text-subtitle-1 text-center mt-4 mb-2 font-weight-medium">
            <v-icon color="red" class="me-2">mdi-calendar</v-icon>
            Eventos programados
          </h3>
        </v-expansion-panel-title>

        <v-expansion-panel-text v-for="evento in eventos" :key="evento.id">
          <v-row dense>
            <span class="text-body-1 font-weight-medium">
              {{ evento.nombre }}
            </span>
            <v-spacer />
            <span class="text-caption text-grey-darken-1">
              {{ evento.hora_inicio }} - {{ evento.hora_fin }}
            </span>
            <v-col cols="12" class="text-caption mb-2">
              {{ evento.descripcion || 'Sin descripción' }}
            </v-col>
            <v-divider />
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  AmbienteInterface,
  EstadoAmbiente,
  EventoInterface,
  ImpresionPiscina,
  PiscinaInterface,
  TipoAmbiente,
} from '@/interfaces'
import { addDays, format } from 'date-fns'
import { getByFecha } from '@/services/venta.service'
import CrearVentaPiscina from './components/CrearVentaPiscina.vue'
import { ImprimirReciboPiscina } from './components'
import { getAmbientes, getEventos } from '@/services'
import { useToastNotify } from '@/composables'

const fecha = ref(new Date())

const tipo = ref<TipoAmbiente>(TipoAmbiente.SAUNA_MIXTO)
const venta = ref<PiscinaInterface[]>([])
const mostrarRecibo = ref(false)
const eventos = ref<EventoInterface[]>([])
const datos = ref<ImpresionPiscina | null>(null)
const ambientes = ref<AmbienteInterface[]>([])
const notify = useToastNotify()

const menores = ref(0)
const mayores = ref(0)

const cambiarDia = async (dias: number) => {
  fecha.value = addDays(fecha.value, dias)
  await obtenerDatos()
  await obtenerEventos()
}

const obtenerAmbientes = async () => {
  try {
    ambientes.value = await getAmbientes(
      EstadoAmbiente.HABILITADO,
      TipoAmbiente.SAUNA_MIXTO
    )
    await obtenerEventos()
  } catch (error: any) {
    notify.error(error.message)
  }
}

const obtenerEventos = async () => {
  try {
    const respuesta = await getEventos(format(fecha.value, 'yyyy-MM-dd'))

    const idsValidos = ambientes.value.map(ambiente => ambiente.id)
    eventos.value = respuesta.filter(evento =>
      evento.ambientes.some(ambiente => idsValidos.includes(ambiente.id))
    )
  } catch (error: any) {
    notify.error(error.message)
  }
}

const obtenerDatos = async () => {
  venta.value = await getByFecha(format(fecha.value, 'yyyy-MM-dd'), tipo.value)
  const piscinaNinios = venta.value.find(
    v => v.nombre_ambiente === 'PISCINA NIÑOS'
  )
  if (piscinaNinios) {
    menores.value = piscinaNinios.cantidad
  } else {
    menores.value = 0
  }
  const piscinaAdultos = venta.value.find(
    v => v.nombre_ambiente === 'PISCINA ADULTOS'
  )
  if (piscinaAdultos) {
    mayores.value = piscinaAdultos.cantidad
  } else {
    mayores.value = 0
  }
}

const close = async (dato: ImpresionPiscina | null) => {
  if (dato) {
    datos.value = dato
    mostrarRecibo.value = true
  } else {
    mostrarRecibo.value = false
    datos.value = null
  }
  await obtenerDatos()
}

onMounted(async () => {
  fecha.value = new Date()
  await obtenerDatos()
  await obtenerAmbientes()
})
</script>

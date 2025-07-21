<template>
  <v-card>
    <v-card-title class="pb-0">
      <v-row class="d-flex align-center">
        <v-col cols="12" md="8" class="d-flex align-center">
          <h3 class="text-h6 font-weight-bold text-center w-100">Eventos</h3>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn color="success" variant="outlined" @click="handleDialog">
            <v-icon start>mdi-plus</v-icon>
            Crear evento
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="4" v-for="evento in eventos">
            <EventoCard :evento="evento" @close="close" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  <v-dialog v-model="crearDialog" max-width="600">
    <CrearEvento @close="handleDialog" />
  </v-dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToastNotify } from '@/composables'
import { EventoInterface } from '@/interfaces'
import { getEventos } from '@/services'
import { EventoCard, CrearEvento } from '.'

const notify = useToastNotify()

const eventos = ref<EventoInterface[]>([])

const crearDialog = ref(false)

const obtenerEventos = async () => {
  try {
    eventos.value = await getEventos()
  } catch (error: any) {
    notify.error(error.message)
  }
}

const handleDialog = async () => {
  crearDialog.value = !crearDialog.value
  if (!crearDialog.value) {
    await obtenerEventos()
  }
}

const close = async () => {
  await obtenerEventos()
}

onMounted(async () => {
  await obtenerEventos()
})
</script>
<style scoped></style>

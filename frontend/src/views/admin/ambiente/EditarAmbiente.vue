<template>
  <v-card>
    <v-card-title> Editar ambiente </v-card-title>
    <v-card-text>
      <v-row>
        <!-- Nombre ambiente -->
        <v-col cols="12" md="7">
          <v-text-field
            v-model="form.nombre"
            label="Nombre del ambiente"
            placeholder="Ingrese nombre del ambiente"
            variant="outlined"
          />
        </v-col>

        <!-- Tipo ambiente -->
        <v-col cols="12" md="5">
          <v-select
            v-model="form.tipo"
            label="Tipo de ambiente"
            :items="tipoAmbientes"
            variant="outlined"
          />
        </v-col>
      </v-row>
      <v-row>
        <!-- Tipo precio -->
        <v-col cols="12" md="5">
          <v-select
            v-model="form.precio_id"
            :items="precios"
            item-title="tipo"
            item-value="id"
            label="Precios disponibles"
            variant="outlined"
          />
        </v-col>

        <!-- Precio -->
        <v-col cols="12" md="3">
          <v-text-field
            v-model="precioSelected"
            variant="outlined"
            label="Precio"
            readonly
          />
        </v-col>

        <!-- Estado ambiente -->
        <v-col cols="12" md="4">
          <v-checkbox v-model="estadoCheck" color="indigo" label="HABILITADO" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="grey" variant="outlined" @click="close"> Cancelar </v-btn>
      <v-btn color="success" variant="outlined" @click="actualizarAmbiente">
        Aceptar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useToastNotify } from '@/composables'
import {
  AmbienteInterface,
  EstadoAmbiente,
  PrecioInterface,
  TipoAmbiente,
} from '@/interfaces'
import { getAmbienteById, getPrecios, updateAmbiente } from '@/services'
import { computed, onMounted, reactive, ref } from 'vue'

const props = defineProps<{ codigo: string }>()
const emit = defineEmits(['close'])

const notify = useToastNotify()

const form = reactive<AmbienteInterface>({
  estado: EstadoAmbiente.HABILITADO,
  nombre: '',
  precio_id: '',
  tipo: TipoAmbiente.SAUNA,
})

const precios = ref<PrecioInterface[]>([])
const tipoAmbientes = Object.values(TipoAmbiente)

const precioSelected = computed(() => {
  const encontrado = precios.value.find(p => p.id === form.precio_id)
  return encontrado ? encontrado.precio : ''
})

const estadoCheck = computed({
  get: () => form.estado === EstadoAmbiente.HABILITADO,
  set: val => {
    form.estado = val ? EstadoAmbiente.HABILITADO : EstadoAmbiente.INHABILITADO
  },
})

const close = () => {
  emit('close')
}

const actualizarAmbiente = async () => {
  try {
    await updateAmbiente(props.codigo, form)
    notify.success('Ambiente actualizado correctamente')
    close()
  } catch (error: any) {
    notify.error(error.message)
  }
}

const obtenerPrecios = async () => {
  try {
    precios.value = await getPrecios()
    if (precios.value.length > 0 && !form.precio_id)
      form.precio_id = precios.value[0].id!
  } catch (error: any) {
    notify.error(error.message)
  }
}

const obtenerAmbiente = async () => {
  try {
    const ambiente = await getAmbienteById(props.codigo)
    Object.assign(form, ambiente)
  } catch (error: any) {
    notify.error(error.message)
  }
}

onMounted(async () => {
  await obtenerPrecios()
  await obtenerAmbiente()
})
</script>

<style scoped></style>

<template>
  <v-card>
    <v-card-title> Editar precio </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="9">
          <v-text-field
            v-model="form.tipo"
            label="Tipo de permiso"
            variant="outlined"
            placeholder="Ingrese el tipo de ambiente"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="form.precio"
            label="Precio"
            variant="outlined"
            placeholder="Precio del ambiente"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="grey" variant="outlined" @click="close"> Cancelar </v-btn>
      <v-btn color="success" variant="outlined" @click="actualizarPrecio">
        Aceptar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useToastNotify } from '@/composables'
import { PrecioInterface } from '@/interfaces'
import { getPrecioById, updatePrecio } from '@/services'
import { onMounted, reactive } from 'vue'

const props = defineProps<{ codigo: string }>()
const emit = defineEmits(['close'])

const notify = useToastNotify()

const form = reactive<PrecioInterface>({
  precio: 0,
  tipo: '',
})

const close = () => {
  emit('close')
}

const actualizarPrecio = async () => {
  try {
    await updatePrecio(props.codigo, form)
    notify.success('Dato de precio actualizado correctamente')
    close()
  } catch (error: any) {
    notify.error(error.message)
  }
}

const obtenerPrecio = async () => {
  try {
    const precio = await getPrecioById(props.codigo)
    Object.assign(form, precio)
  } catch (error: any) {
    notify.error(error.message)
  }
}

onMounted(async () => {
  await obtenerPrecio()
})
</script>

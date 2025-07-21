<template>
  <v-card>
    <v-card-title> Crear Precio </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="9">
          <v-text-field
            v-model="form.tipo"
            label="Tipo de ambiente"
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
      <v-btn color="success" variant="outlined" @click="crearPrecio">
        Aceptar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useToastNotify } from '@/composables'
import { PrecioInterface } from '@/interfaces'
import { createPrecio } from '@/services'
import { reactive } from 'vue'

const emit = defineEmits(['close'])

const notify = useToastNotify()

const form = reactive<PrecioInterface>({
  precio: 0,
  tipo: '',
})

const close = () => {
  emit('close')
}

const crearPrecio = async () => {
  try {
    await createPrecio(form)
    notify.success('Dato de precio creado correctamente')
    close()
  } catch (error: any) {
    notify.error(error.message)
  }
}
</script>

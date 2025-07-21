<template>
  <v-card>
    <v-card-title class="pb-0">
      <v-row align="center">
        <v-col cols="12" md="8" class="d-flex align-center">
          <h3 class="text-h6 font-weight-bold text-center w-100">
            Lista de precios
          </h3>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-end">
          <v-btn color="success" variant="outlined" @click="handleCrear">
            <v-icon start>mdi-plus</v-icon>
            Agregar Precio
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-table class="mt-4">
        <thead>
          <tr>
            <th class="text-subtitle-2 font-weight-bold">N°</th>
            <th class="text-subtitle-2 font-weight-bold">Tipo</th>
            <th class="text-subtitle-2 font-weight-bold">Precio</th>
            <th class="text-subtitle-2 font-weight-bold text-center">
              Opciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(precio, index) in precios" :key="precio.id">
            <td>{{ index + 1 }}</td>
            <td>{{ precio.tipo }}</td>
            <td>{{ precio.precio }}</td>
            <td class="text-center">
              <v-row class="d-flex justify-space-evenly" no-gutters>
                <v-tooltip text="Editar precio" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      density="comfortable"
                      color="warning"
                      v-bind="props"
                      @click="handleEditar(precio.id)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Eliminar precio" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      density="comfortable"
                      color="error"
                      v-bind="props"
                      @click="handleEliminar(precio.id!)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </v-row>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>

    <v-dialog v-model="crearModal" max-width="400" overflow-y="auto">
      <CrearPrecio @close="handleCrear" />
    </v-dialog>
    <v-dialog v-model="editarModal" max-width="400" overflow-y="auto">
      <EditarPrecio :codigo="selected!" @close="handleEditar" />
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConfirmDialog, useToastNotify } from '@/composables'
import { deletePrecio, getPrecios } from '@/services'
import { CrearPrecio, EditarPrecio } from '.'
import { PrecioInterface } from '@/interfaces'

const notify = useToastNotify()
const { show } = useConfirmDialog()

const precios = ref<PrecioInterface[]>([])
const selected = ref<string | null>(null)
const crearModal = ref(false)
const editarModal = ref(false)

const obtenerPrecios = async () => {
  try {
    precios.value = await getPrecios()
  } catch (error: any) {
    notify.error(error.message)
  }
}

const handleCrear = async () => {
  crearModal.value = !crearModal.value
  if (!crearModal.value) await obtenerPrecios()
}

const handleEditar = async (id?: string) => {
  if (id) selected.value = id
  editarModal.value = !editarModal.value
  if (!editarModal.value) await obtenerPrecios()
}

const handleEliminar = async (id: string) => {
  try {
    const confirm = await show(
      'Estas seguro que quieres eliminar el precio?',
      'info'
    )
    if (!confirm) return
    await deletePrecio(id)
    notify.success('Precio eliminado correctamente')
    await obtenerPrecios()
  } catch (error: any) {
    notify.error(error.message)
  }
}

onMounted(async () => {
  await obtenerPrecios()
})
</script>
<style scoped></style>

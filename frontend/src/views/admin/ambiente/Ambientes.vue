<template>
  <v-card>
    <v-card-title class="pb-0">
      <v-row align="center">
        <v-col cols="12" md="8" class="d-flex align-center">
          <h3 class="text-h6 font-weight-bold text-center w-100">
            Lista de ambientes
          </h3>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-end">
          <v-btn color="success" variant="outlined" @click="handleCrear">
            <v-icon start>mdi-plus</v-icon>
            Agregar ambiente
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-table class="mt-4">
        <thead>
          <tr>
            <th class="text-subtitle-2 font-weight-bold">N°</th>
            <th class="text-subtitle-2 font-weight-bold">Nombre</th>
            <th class="text-subtitle-2 font-weight-bold">Tipo de ambiente</th>
            <th class="text-subtitle-2 font-weight-bold">Precio</th>
            <th class="text-subtitle-2 font-weight-bold">Estado</th>
            <th class="text-subtitle-2 font-weight-bold">Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ambiente, index) in ambientes">
            <td>{{ index + 1 }}</td>
            <td>{{ ambiente.nombre }}</td>
            <td>{{ ambiente.tipo }}</td>
            <td>{{ ambiente.precio?.precio }}</td>
            <td>
              <v-tooltip :text="ambiente.estado" location="top">
                <template #activator="{ props }">
                  <v-checkbox
                    :model-value="ambiente.estado === 'HABILITADO'"
                    v-bind="props"
                    readonly
                    density="compact"
                    hide-details
                    color="indigo"
                  />
                </template>
              </v-tooltip>
            </td>
            <td class="text-center">
              <v-row class="d-flex justify-space-evenly" no-gutters>
                <v-tooltip text="Editar ambiente" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      density="comfortable"
                      color="warning"
                      v-bind="props"
                      @click="handleEditar(ambiente.id)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Eliminar ambiente" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      density="comfortable"
                      color="error"
                      v-bind="props"
                      @click="handleEliminar(ambiente.id!)"
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
    <v-dialog v-model="crearModal" max-width="600" overflow-y="auto">
      <CrearAmbiente @close="handleCrear" />
    </v-dialog>
    <v-dialog v-model="editarModal" max-width="600" overflow-y="auto">
      <EditarAmbiente :codigo="selected!" @close="handleEditar" />
    </v-dialog>
  </v-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConfirmDialog, useToastNotify } from '@/composables'
import { AmbienteInterface } from '@/interfaces'
import { deleteAmbiente, getAmbientes } from '@/services'
import { CrearAmbiente, EditarAmbiente } from '.'

const notify = useToastNotify()
const { show } = useConfirmDialog()

const ambientes = ref<AmbienteInterface[]>([])
const crearModal = ref(false)
const editarModal = ref(false)
const selected = ref<string | null>(null)

const obtenerAmbientes = async () => {
  try {
    ambientes.value = await getAmbientes()
  } catch (error: any) {
    notify.error(error.message)
  }
}

const handleCrear = async () => {
  crearModal.value = !crearModal.value
  if (!crearModal.value) await obtenerAmbientes()
}

const handleEditar = async (id?: string) => {
  if (id) selected.value = id
  editarModal.value = !editarModal.value
  if (!editarModal.value) await obtenerAmbientes()
}

const handleEliminar = async (id: string) => {
  try {
    const confirm = await show(
      'Estas seguro que deseas eliminar el ambiente?',
      'info'
    )
    if (!confirm) return
    await deleteAmbiente(id)
    notify.success('Ambiente eliminado correctamente')
    await obtenerAmbientes()
  } catch (error: any) {
    notify.error(error.message)
  }
}

onMounted(async () => {
  await obtenerAmbientes()
})
</script>
<style scoped></style>

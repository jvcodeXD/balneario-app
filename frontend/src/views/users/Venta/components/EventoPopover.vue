<template>
  <v-card min-width="350">
    <v-card-title
      class="d-flex align-center gap-2"
      :class="`bg-${obtenerColorVisual(event.estadoVisual, event.tipo)}`"
    >
      <v-row class="d-flex justify-space-between align-center">
        <v-col v-if="!edit" cols="12" md="auto" class="d-flex align-center">
          <v-icon size="24">{{ obtenerIcono(event.estado) }}</v-icon>
          <span class="font-weight-medium">
            {{ event.title }}
            <span class="text-caption text-opacity-75">
              ({{ event.ambiente.nombre }})
            </span>
          </span>
        </v-col>
        <v-col v-else cols="12" md="6" class="d-flex align-center">
          <v-icon size="24">{{ obtenerIcono(event.estado) }}</v-icon>
          <v-select
            v-model="form.ambiente_id"
            :items="ambientes"
            class="mini-select"
            item-title="nombre"
            item-value="id"
            variant="outlined"
            label="Ambiente"
            density="compact"
            hide-details
            style="max-width: 160px"
          />
        </v-col>
        <v-col v-if="!edit" cols="12" md="auto">
          <v-btn
            color="warning"
            size="small"
            variant="outlined"
            @click="handleEdit"
          >
            <v-icon>mdi-pencil</v-icon>
            Editar
          </v-btn>
        </v-col>

        <v-col v-else cols="12" md="auto">
          <v-btn
            color="green"
            size="small"
            variant="outlined"
            @click="actualizarVenta"
          >
            <v-icon>mdi-check</v-icon>
            Confirmar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-row>
        <v-col col="12" md="6">
          <v-text-field
            :model-value="formatFechaHora(event.start, 'HH:MM')"
            label="Hora de inicio"
            variant="outlined"
            readonly
          />
        </v-col>
        <v-col col="12" md="6">
          <v-text-field
            :model-value="formatFechaHora(event.end, 'HH:MM')"
            label="Hora final"
            variant="outlined"
            readonly
          />
        </v-col>
      </v-row>

      <v-row v-if="event.estado === VentaTipo.RESERVADA">
        <v-col cols="12" md="4">
          <v-text-field
            label="Adelanto"
            variant="outlined"
            :model-value="event.adelanto"
            color="indigo"
            suffix="Bs."
            readonly
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="Restante"
            variant="outlined"
            :model-value="event.precioTotal - event.adelanto"
            color="blue"
            suffix="Bs."
            readonly
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="Precio total"
            variant="outlined"
            :model-value="event.precioTotal"
            color="black"
            suffix="Bs."
            readonly
          />
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-alert
          type="info"
          density="compact"
          border="start"
          variant="tonal"
          color="info"
          icon="mdi-timer-outline"
        >
          {{ obtenerTiempoRestante(event.start, event.end) }}
        </v-alert>
      </v-row>
    </v-card-text>

    <v-card-actions v-if="event.estado === VentaTipo.RESERVADA">
      <v-btn color="red" variant="outlined" @click="cancelarReserva">
        CANCELAR RERSERVA
      </v-btn>
      <v-btn color="green" variant="outlined" @click="confirmarVenta">
        CONFIRMAR VENTA
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {
  useDateFormat,
  obtenerIcono,
  obtenerColorVisual,
  obtenerTiempoRestante,
  useToastNotify,
  useConfirmDialog,
} from '@/composables'
import {
  AmbienteInterface,
  EstadoAmbiente,
  UpdateVentaInterface,
  VentaTipo,
} from '@/interfaces'
import { getAmbientes, getVentaById, updateVenta } from '@/services'
import { useAuthStore } from '@/store'
import { reactive, ref } from 'vue'

const props = defineProps<{
  event: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const notify = useToastNotify()
const authStore = useAuthStore()
const { show } = useConfirmDialog()

const form = reactive<UpdateVentaInterface>({
  id: props.event.id,
  nombre_cliente: '',
  hora_inicio: new Date(),
  hora_fin: new Date(),
  cantidad: 1,
  precio_total: 0.0,
  tipo: VentaTipo.INMEDIATA,
  ambiente_id: props.event.ambiente.id,
  usuario_id: authStore.user.id,
  adelanto: 0,
})

const edit = ref(false)
const ambientes = ref<AmbienteInterface[]>([])

const cancelarReserva = async () => {
  try {
    const confirm = await show(
      'Estas seguro que deseas cancelar la venta?',
      'warning'
    )
    if (!confirm) return

    await updateVenta(props.event.id, {
      tipo: VentaTipo.CANCELADA,
    })
    notify.info('Reserva cancelada exitosamente')
    emit('close')
  } catch (error: any) {
    notify.error(error.message)
  }
}

const obtenerAmbientes = async () => {
  try {
    ambientes.value = await getAmbientes(
      EstadoAmbiente.HABILITADO,
      props.event.ambiente.tipo
    )
  } catch (error: any) {
    notify.error(error.message)
  }
}

const obtenerVenta = async () => {
  try {
    const venta = await getVentaById(props.event.id)
    Object.assign(form, venta)
    form.hora_inicio = new Date(venta.hora_inicio)
    form.hora_fin = new Date(venta.hora_fin)
  } catch (error: any) {
    notify.error(error.message)
  }
}

const actualizarVenta = async () => {
  try {
    await updateVenta(props.event.id, form)
    notify.success('Venta actualizada exitosamente')
    edit.value = false
    emit('close')
  } catch (error: any) {
    notify.error(error.message)
  }
}

const handleEdit = async () => {
  edit.value = !edit.value
  if (edit.value) {
    await obtenerVenta()
    await obtenerAmbientes()
  }
}

const confirmarVenta = async () => {
  try {
    const confirm = await show(
      'Estas seguro que deseas confirmar la venta?',
      'info'
    )
    if (!confirm) return

    await updateVenta(props.event.id, {
      tipo: VentaTipo.RESTANTE,
      usuario_id: authStore.user.id,
    })
    notify.info('Reserva confirmada exitosamente')
    emit('close')
  } catch (error: any) {
    notify.error(error.message)
  }
}

const { formatFechaHora } = useDateFormat()
</script>

<style>
.mini-select .v-field {
  min-height: 20px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

.mini-select .v-field__input {
  font-size: 10px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}
.mini-select .v-list-item {
  min-height: 20px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}
</style>

<template>
  <v-btn color="success" variant="outlined" @click="handleDialog"
    >Crear venta</v-btn
  >
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6 bg-light-green-lighten-3">
        <v-icon>mdi-calendar-edit</v-icon>
        SAUNA MIXTO
      </v-card-title>
      <v-card-text>
        <!-- Adultos -->
        <v-row class="d-flex justify-space-between">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="formAdultos.cantidad"
              variant="outlined"
              label="Adultos"
              type="number"
              prepend-inner-icon="mdi-account"
              max="50"
              min="0"
              @update:modelValue="actualizarPrecio('ADULTOS')"
            />
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="formAdultos.precio_total"
              variant="outlined"
              label="Precio"
              prepend-inner-icon="mdi-cash"
              color="blue"
              suffix="Bs."
              readonly
            />
          </v-col>
        </v-row>

        <!-- Niños -->
        <v-row class="d-flex justify-space-between">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="formNinos.cantidad"
              variant="outlined"
              label="Niños"
              type="number"
              prepend-inner-icon="mdi-human-child"
              max="50"
              min="0"
              @update:modelValue="actualizarPrecio('NINOS')"
            />
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="formNinos.precio_total"
              variant="outlined"
              label="Precio"
              prepend-inner-icon="mdi-cash"
              color="blue"
              suffix="Bs."
              readonly
            />
          </v-col>
        </v-row>

        <!-- Total -->
        <v-row class="mt-4 d-flex justify-end">
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-text-field
              v-model="total"
              style="text-align: right"
              label="Precio total"
              prepend-inner-icon="mdi-cash-multiple"
              variant="underlined"
              readonly
              suffix="Bs."
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close(null)">Cancelar</v-btn>
        <v-btn color="success" @click="crearVenta">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { useConfirmDialog, useToastNotify } from '@/composables'
import { EstadoAmbiente, ImpresionPiscina, TipoAmbiente } from '@/interfaces'
import { CrearVentaInterface } from '@/interfaces'
import { VentaTipo } from '@/interfaces'
import { createVenta, getAmbientes } from '@/services'
import { useAuthStore } from '@/store'
import { computed, onMounted, reactive, ref } from 'vue'

const props = defineProps<{
  tipo: string
}>()
const emit = defineEmits<{
  (e: 'close', datos: ImpresionPiscina | null): void
}>()

const authStore = useAuthStore()
const notify = useToastNotify()
const { show } = useConfirmDialog()

const ambienteNinosId = ref<string>('')
const ambienteAdultosId = ref<string>('')
const precioNinos = ref<number>(0)
const precioAdultos = ref<number>(0)
const dialog = ref(false)
const total = computed(() => {
  return formAdultos.precio_total + formNinos.precio_total
})

const formNinos = reactive<CrearVentaInterface>({
  nombre_cliente: '',
  hora_inicio: new Date(),
  hora_fin: new Date(),
  cantidad: 0,
  precio_total: 0.0,
  tipo: VentaTipo.INMEDIATA,
  ambiente_id: ambienteNinosId.value,
  usuario_id: authStore.user.id,
  celular_cliente: '',
  adelanto: 0,
})

const formAdultos = reactive<CrearVentaInterface>({
  nombre_cliente: '',
  hora_inicio: new Date(),
  hora_fin: new Date(),
  cantidad: 0,
  precio_total: 0.0,
  tipo: VentaTipo.INMEDIATA,
  ambiente_id: ambienteAdultosId.value,
  usuario_id: authStore.user.id,
  celular_cliente: '',
  adelanto: 0,
})

const actualizarPrecio = (tipo: 'NINOS' | 'ADULTOS') => {
  if (tipo === 'NINOS') {
    formNinos.precio_total = precioNinos.value * formNinos.cantidad
    formNinos.ambiente_id = ambienteNinosId.value
  } else {
    formAdultos.precio_total = precioAdultos.value * formAdultos.cantidad
    formAdultos.ambiente_id = ambienteAdultosId.value
  }
}

const obtenerAmbientes = async () => {
  const ambienteNinos = await getAmbientes(
    EstadoAmbiente.HABILITADO,
    TipoAmbiente.SAUNA_MIXTO,
    'PISCINA NIÑOS'
  )
  const ambienteAdultos = await getAmbientes(
    EstadoAmbiente.HABILITADO,
    TipoAmbiente.SAUNA_MIXTO,
    'PISCINA ADULTOS'
  )
  ambienteNinosId.value = ambienteNinos[0]?.id || ''
  ambienteAdultosId.value = ambienteAdultos[0]?.id || ''
  precioNinos.value = ambienteNinos[0]?.precio?.precio || 0
  precioAdultos.value = ambienteAdultos[0]?.precio?.precio || 0
}

const crearVenta = async () => {
  try {
    const confirm = await show(
      'Estas seguro que deseas realizar la venta?',
      'confirm-only'
    )
    if (!confirm) return
    Object.assign(formNinos, {
      hora_inicio: new Date(),
      hora_fin: new Date(),
    })
    Object.assign(formAdultos, {
      hora_inicio: new Date(),
      hora_fin: new Date(),
    })
    if (formNinos.cantidad !== 0) await createVenta(formNinos)
    if (formAdultos.cantidad !== 0) await createVenta(formAdultos)

    const datos: ImpresionPiscina = {
      ninos: formNinos.cantidad,
      adultos: formAdultos.cantidad,
      precioNino: precioNinos.value,
      precioAdulto: precioAdultos.value,
      usuario_id: authStore.user.id,
    }
    await reinicio()
    close(datos)
    notify.success('Venta creada exitosamente')
  } catch (error: any) {
    notify.error(error.message)
  }
}

const close = (datos: ImpresionPiscina | null) => {
  dialog.value = false
  emit('close', datos)
}

const handleDialog = () => {
  dialog.value = !dialog.value
}

const reinicio = async () => {
  Object.assign(formNinos, {
    nombre_cliente: '',
    hora_inicio: new Date(),
    hora_fin: new Date(),
    cantidad: 0,
    precioTotal: 0.0,
    tipo: VentaTipo.INMEDIATA,
    ambiente_id: ambienteNinosId.value,
    usuario_id: authStore.user.id,
    celular_cliente: '',
  })

  Object.assign(formAdultos, {
    nombre_cliente: '',
    hora_inicio: new Date(),
    hora_fin: new Date(),
    cantidad: 0,
    precioTotal: 0.0,
    tipo: VentaTipo.INMEDIATA,
    ambiente_id: ambienteAdultosId.value,
    usuario_id: authStore.user.id,
    celular_cliente: '',
  })

  await obtenerAmbientes()
}

onMounted(async () => {
  await obtenerAmbientes()
})
</script>
<style scope></style>

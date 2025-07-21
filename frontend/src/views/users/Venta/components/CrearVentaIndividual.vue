<template>
  <v-card>
    <v-card-title class="text-h6 bg-light-green-lighten-3">
      <v-icon>mdi-calendar-edit</v-icon>
      {{ props.nombre }}
    </v-card-title>

    <v-card-text>
      <!-- Nombre o apellido del cliente -->
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="form.nombre_cliente"
            variant="outlined"
            label="Cliente"
            prepend-inner-icon="mdi-account"
            placeholder="Ingrese nombre o apellido del cliente"
          />
        </v-col>
      </v-row>

      <!-- Hora de inicio y fin -->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="hora_inicio"
            label="Hora de inicio"
            placeholder="00:00"
            prepend-inner-icon="mdi-clock"
            variant="outlined"
            :active="menuHoraInicio"
          >
            <v-menu
              v-model="menuHoraInicio"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-time-picker
                v-model="hora_inicio"
                scrollable
                format="24hr"
                color="success"
                class="time-picker-sm"
                @update:hour="
                  (val: any) => actualizarHora(val, 'HORA', 'INICIO')
                "
                @update:minute="
                  (val: any) => actualizarHora(val, 'MINUTO', 'INICIO')
                "
              />
            </v-menu>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="hora_fin"
            label="Hora final"
            placeholder="00:00"
            prepend-inner-icon="mdi-clock"
            variant="outlined"
            :active="menuHoraFin"
          >
            <v-menu
              v-model="menuHoraFin"
              :close-on-content-click="false"
              activator="parent"
            >
              <v-time-picker
                v-model="hora_fin"
                scrollable
                format="24hr"
                color="warning"
                class="time-picker-sm"
                @update:hour="(val: any) => actualizarHora(val, 'HORA', 'FIN')"
                @update:minute="
                  (val: any) => actualizarHora(val, 'MINUTO', 'FIN')
                "
              />
            </v-menu>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Diferencia de tiempo y costo total -->
      <v-row>
        <!-- Diferencia de tiempo -->

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.cantidad"
            label="Cantidad"
            type="number"
            min="1"
            max="5"
            variant="outlined"
            @update:modelValue="actualizarPrecio"
          />
        </v-col>

        <!-- Precio total -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.precio_total"
            variant="outlined"
            label="Precio total"
            color="blue"
            suffix="Bs."
            prepend-inner-icon="mdi-cash"
            readonly
          />
        </v-col>
      </v-row>

      <!-- Cantidad de personas -->
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="diferenciaTiempo"
            variant="outlined"
            prepend-inner-icon="mdi-timer-sand"
            label="Tiempo de uso"
            realonly
          />
        </v-col>
      </v-row>

      <!-- Reserva -->
      <v-row>
        <v-col cols="12" md="6">
          <v-checkbox
            v-model="esReserva"
            label="¿Es una reserva?"
            color="indigo"
            hide-details
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-if="esReserva"
            v-model="form.adelanto"
            label="Adelanto (opcional)"
            variant="outlined"
            prepend-inner-icon="mdi-cash-fast"
            type="number"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn text @click="close">Cancelar</v-btn>
      <v-btn color="success" @click="crearVentaIndividual">Aceptar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useConfirmDialog, useDateFormat, useToastNotify } from '@/composables'
import { useAuthStore } from '@/store'
import { AmbienteInterface, CrearVentaInterface, VentaTipo } from '@/interfaces'
import { createVenta, getAmbienteById } from '@/services'

const props = defineProps<{
  horaActual: Date
  codigo: string
  nombre: string
}>()
const emit = defineEmits<{
  (e: 'close', id: string | null): void
}>()

const { formatFechaHora } = useDateFormat()
const authStore = useAuthStore()
const notify = useToastNotify()
const { show } = useConfirmDialog()

const form = reactive<CrearVentaInterface>({
  nombre_cliente: '',
  hora_inicio: new Date(props.horaActual),
  hora_fin: new Date(props.horaActual),
  cantidad: 1,
  precio_total: 0.0,
  tipo: VentaTipo.INMEDIATA,
  ambiente_id: props.codigo,
  usuario_id: authStore.user.id,
  adelanto: 0,
})

const hora_inicio = ref('')
const hora_fin = ref('')
const diferenciaTiempo = ref('')
const precio = ref(0)
const precioTotal = ref(0)

const ambiente = ref<AmbienteInterface | null>(null)

const menuHoraInicio = ref(false)
const menuHoraFin = ref(false)

const esReserva = computed({
  get: () => form.tipo === VentaTipo.RESERVADA,
  set: value => {
    form.tipo = value ? VentaTipo.RESERVADA : VentaTipo.INMEDIATA
  },
})

const acercarHora = () => {
  const nuevaHora = new Date(props.horaActual) // Copia para no mutar la original
  const minutos = nuevaHora.getMinutes()

  if (minutos < 15) {
    nuevaHora.setMinutes(0, 0, 0)
  } else if (minutos < 45) {
    nuevaHora.setMinutes(30, 0, 0)
  } else {
    nuevaHora.setHours(nuevaHora.getHours() + 1)
    nuevaHora.setMinutes(0, 0, 0)
  }

  const final = new Date(nuevaHora)
  final.setHours(nuevaHora.getHours() + 1)
  hora_inicio.value = formatFechaHora(nuevaHora, 'HH:MM')
  hora_fin.value = formatFechaHora(final, 'HH:MM')
  calcularDiferencia()
}

const calcularDiferencia = () => {
  const inicio = new Date(
    `${formatFechaHora(props.horaActual, 'YYYY-MM-DD')} ${hora_inicio.value}`
  )
  const fin = new Date(
    `${formatFechaHora(props.horaActual, 'YYYY-MM-DD')} ${hora_fin.value}`
  )
  // Verificar si la fecha de fin es anterior
  if (fin.getTime() < inicio.getTime()) {
    return '0 minutos'
  }

  const diferencia = fin.getTime() - inicio.getTime()
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  const horas = Math.floor(
    (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))

  const partes = []
  if (dias > 0) partes.push(`${dias} día${dias > 1 ? 's' : ''}`)
  if (horas > 0) partes.push(`${horas} hora${horas > 1 ? 's' : ''}`)
  if (minutos > 0) partes.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`)

  diferenciaTiempo.value = partes.length > 0 ? partes.join(', ') : '0 minutos'

  const totalMinutos = Math.floor(diferencia / (1000 * 60))
  const horasDecimal = totalMinutos / 60
  precioTotal.value = parseFloat((precio.value * horasDecimal).toFixed(2))
  actualizarPrecio()
}

const actualizarHora = (val: any, tipo: string, selected: string) => {
  const pad = (n: any) => String(n).padStart(2, '0')

  if (selected === 'INICIO') {
    const [hora, minuto] = hora_inicio.value!.split(':')
    hora_inicio.value =
      tipo === 'HORA'
        ? `${pad(val)}:${pad(minuto)}`
        : `${pad(hora)}:${pad(val)}`
  } else {
    const [hora, minuto] = hora_fin.value!.split(':')
    hora_fin.value =
      tipo === 'HORA'
        ? `${pad(val)}:${pad(minuto)}`
        : `${pad(hora)}:${pad(val)}`
  }

  // Cerrar menú al seleccionar minuto
  if (tipo === 'MINUTO') {
    selected === 'INICIO'
      ? (menuHoraInicio.value = false)
      : (menuHoraFin.value = false)
  }
  calcularDiferencia()
}

const actualizarPrecio = () => {
  form.precio_total = precioTotal.value * form.cantidad
}

const obtenerAmbiente = async () => {
  try {
    ambiente.value = await getAmbienteById(props.codigo)
    precio.value = ambiente.value.precio!.precio
    precioTotal.value = precio.value
    form.precio_total = precio.value
  } catch (error: any) {
    notify.error(error.message)
  }
}

const crearVentaIndividual = async () => {
  try {
    const confirm = await show(
      'Estas seguro que deseas realizar la venta?',
      'confirm-only'
    )
    if (!confirm) return
    Object.assign(form, {
      hora_inicio: new Date(
        `${formatFechaHora(props.horaActual, 'YYYY-MM-DD')} ${hora_inicio.value}`
      ),
      hora_fin: new Date(
        `${formatFechaHora(props.horaActual, 'YYYY-MM-DD')} ${hora_fin.value}`
      ),
    })
    const venta = await createVenta(form)
    notify.success(
      `${form.tipo === VentaTipo.INMEDIATA ? 'Venta' : 'Reserva'} creada exitosamente`
    )
    close(venta.id)
  } catch (error: any) {
    notify.error(error.message)
  }
}

const close = (id?: string) => {
  emit('close', id ?? null)
}

onMounted(async () => {
  await obtenerAmbiente()
  acercarHora()
})
</script>

<style scoped>
.time-picker-sm {
  max-width: 400px;
  transform: scale(0.75);
  transform-origin: top left;
}
</style>

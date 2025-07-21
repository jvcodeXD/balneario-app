<template>
  <div>
    <v-btn color="primary" prepend-icon="mdi-file-pdf-box" @click="exportarPDF">
      Exportar PDF
    </v-btn>

    <div ref="calendarioRef">
      <vue-cal
        :disable-views="['years', 'year', 'month', 'week']"
        active-view="day"
        :split-days="ambientes"
        sticky-split-labels
        :events="ventas"
        todayButton
        show-time-in-cells
        v-model:selected-date="fechaCal"
        locale="es"
        @cell-click="crearVenta('cell-click', $event)"
        @view-change="handleViewChange"
      >
        <template #event="{ event: venta }">
          <div
            v-if="venta.estado === 'EVENTO'"
            :style="{
              background:
                'repeating-linear-gradient(45deg, rgba(255,140,0,0.3), rgba(255,140,0,0.3) 10px, rgba(255,165,0,0.3) 10px, rgba(255,165,0,0.3) 20px)',
              width: '100%',
              height: '100%',
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'center',
              'box-sizing': 'border-box',
              'font-weight': 'bold',
            }"
          >
            {{ venta.title }}
          </div>
          <EventoVenta v-else :evento="venta" @close="cerrarVenta" />
        </template>
      </vue-cal>
    </div>
    <v-dialog v-model="ventaModal" max-width="350" overflow-y="auto">
      <component
        :is="componenteVenta"
        :horaActual="horaSelected"
        :codigo="ambienteSelected"
        :nombre="ambiente"
        @close="cerrarVenta"
      />
    </v-dialog>
    <ImprimirRecibo v-if="ventaId" :codigo="ventaId" @close="cerrarVenta" />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import VueCal from 'vue-cal'
import { computed, onMounted, ref } from 'vue'
import { useToastNotify, actualizarEstadoVisualEventos } from '@/composables'
import {
  AmbienteInterface,
  EstadoAmbiente,
  EventoInterface,
  TipoAmbiente,
} from '@/interfaces'
import { getAmbientes, getEventos, getVentas } from '@/services'
import {
  EventoVenta,
  CrearVentaSaunaFamiliar,
  CrearVentaIndividual,
  ImprimirRecibo,
} from './components'
import 'vue-cal/dist/vuecal.css'
import { format } from 'date-fns'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const props = defineProps<{ tipo: TipoAmbiente }>()
const notify = useToastNotify()

const calendarioRef = ref<HTMLElement | null>(null)

const ventaModal = ref(false)
const ambienteSelected = ref('')
const ambiente = ref<string>('')
const horaSelected = ref(new Date())
const ventaId = ref<string | null>(null)
const mostrarRecibo = ref(false)
const fecha = ref(format(new Date(), 'yyyy-MM-dd'))
const fechaCal = ref(new Date())

const ambientes = ref<AmbienteInterface[]>([])
const ventas = ref<any[]>([])
const eventos = ref<EventoInterface[]>([])

const componenteVenta = computed(() => {
  switch (props.tipo) {
    case TipoAmbiente.FAMILIAR:
    case TipoAmbiente.SAUNA:
      return CrearVentaSaunaFamiliar
    case TipoAmbiente.INDIVIDUAL:
      return CrearVentaIndividual
    default:
      return CrearVentaSaunaFamiliar
  }
})

const crearVenta = (cell: any, event: any) => {
  ventaModal.value = true
  ambienteSelected.value = event.split
  ambiente.value = ambientes.value.find(amb => amb.id === event.split)!.nombre
  horaSelected.value = event.date
}

const obtenerVentas = async (fechaActual: Date) => {
  try {
    const res = await getVentas(props.tipo, format(fechaActual, 'yyyy-MM-dd'))
    ventas.value = res.map(venta => ({
      start: new Date(venta.hora_inicio),
      end: new Date(venta.hora_fin),
      title: venta.nombre_cliente,
      tipo: venta.tipo,
      estado: venta.tipo,
      split: venta.ambiente_id,
      menu: false,
      ambiente: venta.ambiente,
      precioTotal: venta.precio_total,
      adelanto: venta.adelanto,
      id: venta.id,
    }))
    await obtenerEventos(fechaActual)
  } catch (error: any) {
    notify.error(error.message)
  }
}

const cerrarVenta = async (id: string | null) => {
  ventaId.value = null
  mostrarRecibo.value = false
  if (id) {
    mostrarReciboId(id)
  }
  ventaModal.value = false
  await obtenerVentas(fechaCal.value)
}

const handleViewChange = async ({ startDate }: any) => {
  fecha.value = format(startDate, 'yyyy-MM-dd')
  await obtenerVentas(startDate)
}

const obtenerEventos = async (fechaActual: Date) => {
  eventos.value = await getEventos(fecha.value)
  ventas.value = ventas.value.filter((event: any) => event.estado !== 'EVENTO')

  eventos.value.forEach(evento => {
    const [inicioHora, inicioMinuto] = evento.hora_inicio.split(':').map(Number)
    const [finHora, finMinuto] = evento.hora_fin.split(':').map(Number)

    const inicio = new Date(fechaActual)
    const fin = new Date(fechaActual)
    inicio.setHours(inicioHora)
    inicio.setMinutes(inicioMinuto)
    fin.setHours(finHora)
    fin.setMinutes(finMinuto)

    evento.ambientes.forEach(ambiente => {
      // Verificamos si el ambiente del evento está dentro de los ambientes mostrados
      const existe = ambientes.value.some(a => a.id === ambiente.id)
      if (!existe) return

      const nuevoEvento = {
        start: inicio,
        end: fin,
        title: evento.nombre,
        estado: 'EVENTO',
        split: ambiente.id,
        class: 'evento-limpieza',
      }

      ventas.value.push(nuevoEvento)
    })
  })
}

const exportarPDF = async () => {
  if (!calendarioRef.value) return

  const canvas = await html2canvas(calendarioRef.value, { scale: 1.5 })
  const imgData = canvas.toDataURL('image/jpeg', 0.8)

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const margenIzquierda = 30 // 3 cm
  const margenArriba = 25 // 2 cm
  const margenDerecha = 25 // 2 cm
  const margenAbajo = 25 // 2 cm

  const contenidoAncho = pageWidth - margenIzquierda - margenDerecha
  const contenidoAlto = pageHeight - margenArriba - margenAbajo

  // Imagen al 100% del ancho disponible, se ajusta en altura aunque se deforme
  const imgWidth = contenidoAncho
  const imgHeight = (canvas.height / canvas.width) * imgWidth

  // Si la altura no alcanza, la estiramos para ocupar todo el alto disponible
  const finalImgHeight = Math.max(imgHeight, contenidoAlto)

  pdf.addImage(
    imgData,
    'JPEG',
    margenIzquierda,
    margenArriba,
    imgWidth,
    finalImgHeight
  )

  const texto = `${fecha.value} - ${props.tipo}`
  pdf.setFontSize(10)
  pdf.text(texto, margenIzquierda, pageHeight - 5)

  pdf.save(texto)
}

const obtenerAmbientes = async () => {
  try {
    const res = await getAmbientes(EstadoAmbiente.HABILITADO, props.tipo)
    ambientes.value = res.map((ambiente: AmbienteInterface, index: number) => ({
      ...ambiente,
      label: ambiente.nombre,
      class: `split${(index % 2) + 1}`,
    }))
  } catch (error: any) {
    notify.error(error.message)
  }
}

const mostrarReciboId = (id: string) => {
  ventaId.value = id
  mostrarRecibo.value = true
}

const actualizarDatos = async () => {
  await obtenerAmbientes()
  await obtenerVentas(fechaCal.value)
  actualizarEstadoVisualEventos(ventas.value)
}

onMounted(async () => {
  await actualizarDatos()
  setInterval(() => {
    actualizarDatos()
  }, 10000)
})
</script>

<style>
/* Encabezado de las divisiones del día */
.vuecal .day-split-header {
  font-size: 14px;
  font-weight: bold;
}

/* Evento de limpieza con líneas diagonales en naranja */
.vuecal__event.evento {
  background: repeating-linear-gradient(
    45deg,
    rgba(255, 140, 0, 0.3),
    rgba(255, 140, 0, 0.3) 10px,
    rgba(255, 165, 0, 0.3) 10px,
    rgba(255, 165, 0, 0.3) 20px
  );
}

.vuecal__event {
  background-color: rgba(193, 194, 196, 0.9);
  border: 1px solid rgba(238, 238, 243, 0.788);
  color: #fff;
}

.evento-vuecal {
  height: 100%;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  text-align: center;
}

/* Fondo y borde de las celdas (Splits) */
.vuecal__body .split1 {
  background-color: rgba(240, 243, 245, 0.9); /* Gris claro */
  border: 1px solid #d1d5db; /* Borde gris */
}

.vuecal__body .split2 {
  background-color: rgba(225, 228, 230, 0.9); /* Gris oscuro */
  border: 1px solid #d1d5db; /* Borde gris */
}
a .boton-imprimir {
  position: sticky;
  top: 10px;
  right: 60px;
  z-index: 999;
}
</style>

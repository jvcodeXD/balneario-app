<template>
  <div>
    <v-dialog v-model="dialog" max-width="900px">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Reporte Diario</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="imprimir">
            <v-icon>mdi-printer</v-icon>
          </v-btn>
          <v-btn icon @click="cerrar">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <iframe
            v-if="pdfUrl"
            :src="pdfUrl"
            ref="iframe"
            style="width: 100%; height: 600px; border: none"
          ></iframe>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useToastNotify } from '@/composables'

const dialog = ref(true)
const pdfUrl = ref<string | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)
const notify = useToastNotify()

const props = defineProps<{
  usuario_id: string
  fecha_inicio: Date
  fecha_fin: Date
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const cargarReporte = async () => {
  try {
    const response = await api.post(
      'reporte/diario/pdf',
      {
        usuario_id: props.usuario_id,
        fecha_inicio: props.fecha_inicio,
        fecha_fin: props.fecha_fin,
      },
      {
        responseType: 'blob',
      }
    )

    const blob = new Blob([response.data], { type: 'application/pdf' })
    pdfUrl.value = URL.createObjectURL(blob)
    dialog.value = true
  } catch (error: any) {
    notify.error(error.message)
  }
}

const cerrar = () => {
  dialog.value = false
  emit('close')
}

const imprimir = () => {
  if (iframe.value?.contentWindow) {
    iframe.value.contentWindow.focus()
    iframe.value.contentWindow.print()
  }
  emit('close')
}

onMounted(async () => {
  console.log(props)
  await cargarReporte()
})
</script>

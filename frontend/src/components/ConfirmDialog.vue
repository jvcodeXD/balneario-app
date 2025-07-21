<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon :color="color" size="32" class="me-3">
          {{ icon }}
        </v-icon>
        <p class="text-h6 text-wrap" style="white-space: normal; word-break: break-word">
          {{ message }}
        </p>
      </v-card-title>

      <v-card-actions>
        <v-spacer />
        <v-btn v-if="type !== 'confirm-only'" color="grey darken-1" variant="text" @click="cancel">
          Cancelar
        </v-btn>
        <v-btn :color="color" variant="flat" @click="confirm"> Confirmar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const { dialog, message, type, confirm, cancel } = useConfirmDialog()

const icon = computed(() => {
  switch (type.value) {
    case 'info':
      return 'mdi-information'
    case 'warning':
      return 'mdi-alert'
    case 'error':
      return 'mdi-alert-circle'
    case 'success':
      return 'mdi-check-circle'
    default:
      return 'mdi-help-circle'
  }
})

const color = computed(() => {
  switch (type.value) {
    case 'info':
      return 'info'
    case 'warning':
      return 'warning'
    case 'error':
      return 'error'
    case 'success':
      return 'success'
    default:
      return 'primary'
  }
})
</script>

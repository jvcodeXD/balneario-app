<template>
  <v-card elevation="2">
    <v-card-text class="d-flex">
      <v-avatar size="72" class="me-4">
        <v-img :src="imageUrl" cover />
      </v-avatar>

      <div class="flex-grow-1">
        <div class="text-subtitle-1 font-weight-medium">
          {{ user.fullname }}
        </div>
        <div class="text-caption text-grey-lighten-1">
          <strong>Usuario: </strong>{{ user.username }}
        </div>
        <div class="text-caption mb-2">
          Rol: <strong>{{ user.role }}</strong>
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="pt-0 d-flex justify-space-between">
      <v-btn variant="outlined" color="warning" @click="$emit('edit', user)">
        <v-icon start size="18">mdi-pencil</v-icon>
        Editar
      </v-btn>

      <v-btn variant="outlined" color="error" @click="$emit('delete', user)">
        <v-icon start size="18">mdi-delete</v-icon>
        Eliminar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UsuarioInterface } from '@/interfaces'

const props = defineProps<{
  user: UsuarioInterface
}>()

const imageUrl = computed(() =>
  props.user.picture
    ? `http://localhost:4000${props.user.picture}`
    : '/placeholder-user.png'
)
</script>

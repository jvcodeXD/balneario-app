<template>
  <v-list-item class="d-flex flex-column align-center pt-4 pb-1">
    <v-avatar size="64">
      <img
        :src="picture"
        alt="Foto de perfil"
        style="object-fit: cover; width: 100%; height: 100%"
      />
    </v-avatar>
    <div
      v-if="showName"
      class="mt-2 text-subtitle-2 font-weight-medium text-center"
      style="max-width: 100px; word-break: break-word"
    >
      {{ name }}
    </div>
  </v-list-item>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  picture: string
  showName: boolean
}>()
</script>

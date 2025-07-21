<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5">Sobre este Proyecto Base</v-card-title>
      <v-card-text>
        <p>Este proyecto base incluye Vue 3, Vuetify 3, Pinia y Vue Router.</p>
        <p>
          Ideal para comenzar tus desarrollos con una estructura limpia y
          escalable.
        </p>
        <v-btn color="secondary" @click="goHome">Volver al Home</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push({ name: "Home" });
};
</script>

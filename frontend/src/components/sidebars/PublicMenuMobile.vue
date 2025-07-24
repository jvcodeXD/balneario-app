<template>
  <v-app-bar color="primary" dark app>
    <!-- Botón hamburguesa con menú -->
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>

      <!-- Menú desplegable -->
      <v-list>
        <v-list-item @click="navegar('Home')">
          <v-icon start>mdi-home</v-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item @click="navegar('About')">
          <v-icon start>mdi-information</v-icon>
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>

        <v-list-item @click="navegar('Login')">
          <v-icon start>mdi-login</v-icon>
          <v-list-item-title>Iniciar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Título -->
    <v-toolbar-title>Balneario</v-toolbar-title>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navegar = (ruta: string) => {
  router.push({ name: ruta })
}
</script>

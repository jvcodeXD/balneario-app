<template>
  <v-navigation-drawer app :permanent="true" :width="drawer ? 200 : 72" color="primary" dark>
    <v-list dense nav>
      <!-- Perfil genérico -->
      <v-list-item class="d-flex flex-column align-center pt-4 pb-1">
        <v-icon size="48">mdi-account-circle-outline</v-icon>
        <div v-if="drawer" class="mt-2 text-subtitle-2 font-weight-medium text-center">
          Bienvenido
        </div>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-item @click="goTo('Home')">
        <v-icon>mdi-home</v-icon>
        <v-list-item-title v-if="drawer">Home</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('About')">
        <v-icon>mdi-information</v-icon>
        <v-list-item-title v-if="drawer">About</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('Login')">
        <v-icon>mdi-login</v-icon>
        <v-list-item-title v-if="drawer">Iniciar Sesión</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-btn icon @click="$emit('toggle-drawer')" class="mt-auto mb-4" color="secondary">
      <v-icon>{{ drawer ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
    </v-btn>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{ drawer: boolean }>()
const emit = defineEmits(['toggle-drawer'])

const router = useRouter()

const goTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

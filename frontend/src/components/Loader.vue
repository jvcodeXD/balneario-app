<template>
  <div class="fullscreen-loader" v-if="visible">
    <div class="loader-box">
      <div class="animation-container">
        <Vue3Lottie
          :animationData="animation"
          :height="150"
          :width="150"
          loop
        />
      </div>
      <span class="text-caption mt-2">Cargando...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import animation from '@/assets/swimming-loader.json'
defineProps<{ visible: boolean }>()
</script>

<style scoped>
.fullscreen-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-box {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.animation-container {
  height: 90px; /* 🔁 Ajusta según cuánto quieras recortar */
  overflow: hidden;
  border-radius: 12px;
}
</style>

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import vuetify from './plugins/vuetify'
import router from './router'
import Vue3Toastify, { type ToastContainerOptions, toast } from 'vue3-toastify'
import { useToastStore } from './store'
import VueECharts from 'vue-echarts'
import * as ECharts from 'echarts'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersistedstate)

app.use(Vue3Toastify, {
  autoClose: 1500,
} as ToastContainerOptions)

app.config.globalProperties.$toast = toast
app.config.globalProperties.$toastStore = useToastStore()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.component('v-chart', VueECharts)
app.mount('#app')

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: typeof toast
    $toastStore: ReturnType<typeof useToastStore>
  }
}

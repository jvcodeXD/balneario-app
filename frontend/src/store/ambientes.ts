import { defineStore } from 'pinia'

export const useAmbientesStore = defineStore('ambientes', {
  state: () => ({
    seleccionados: [] as string[], // IDs de los ambientes
  }),
  actions: {
    setSeleccionados(ids: string[]) {
      this.seleccionados = ids
    },
    agregarSeleccion(id: string) {
      if (!this.seleccionados.includes(id)) {
        this.seleccionados.push(id)
      }
    },
    quitarSeleccion(id: string) {
      this.seleccionados = this.seleccionados.filter(i => i !== id)
    },
    limpiarSeleccion() {
      this.seleccionados = []
    },
  },
  persist: true,
})

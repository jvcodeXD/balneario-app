<template>
  <v-sheet elevation="3" rounded="lg">
    <v-tabs
      v-model="tab"
      :items="tabs"
      align-tabs="center"
      height="60"
      slider-color="#f78166"
    >
      <template v-slot:tab="{ item }">
        <v-tab
          :prepend-icon="item.icon"
          :text="item.text"
          :value="item.value"
          class="text-none"
        ></v-tab>
      </template>

      <template v-slot:item="{ item }">
        <v-tabs-window-item :value="item.value" class="pa-4">
          <component :is="getComponent(item.value)" :tipo="item.value" />
        </v-tabs-window-item>
      </template>
    </v-tabs>
  </v-sheet>
</template>
<script setup lang="ts">
import { shallowRef } from 'vue'
import { SaunaMixto, Ambiente } from '.'
import { TipoAmbiente } from '@/interfaces'

const tab = shallowRef('piscina')
const tabs = [
  {
    icon: 'mdi-pool',
    text: 'Sauna Mixto',
    value: TipoAmbiente.SAUNA_MIXTO,
  },
  {
    icon: 'mdi-hot-tub',
    text: 'Sauna',
    value: TipoAmbiente.SAUNA,
  },
  {
    icon: 'mdi-account',
    text: 'Individual',
    value: TipoAmbiente.INDIVIDUAL,
  },
  {
    icon: 'mdi-account-group',
    text: 'Familiar',
    value: TipoAmbiente.FAMILIAR,
  },
]
const getComponent = (tabName: TipoAmbiente) => {
  if (tabName === TipoAmbiente.SAUNA_MIXTO) return SaunaMixto
  return Ambiente
}
</script>

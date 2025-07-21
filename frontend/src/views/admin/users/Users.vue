<template>
  <v-container>
    <v-row>
      <v-btn color="green-lighten-3" class="mb-4" @click="openCreate">
        Crear usuario
      </v-btn>

      <CreateUser v-model="modalCreate" @saved="reloadUsuarios" />
      <EditUser
        v-if="selectedUser"
        v-model="modalEdit"
        :user="selectedUser"
        @saved="reloadUsuarios"
      />

      <v-col
        v-for="user in usuarios"
        :key="user.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <UserCard :user="user" @edit="editUser" @delete="confirmDelete" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useConfirmDialog, useToastNotify } from '@/composables'
import { getUsers, deleteUser } from '@/services'
import { UsuarioInterface } from '@/interfaces'
import { CreateUser, EditUser, UserCard } from '.'

const usuarios = ref<UsuarioInterface[]>([])
const { show } = useConfirmDialog()

const modalCreate = ref(false)
const modalEdit = ref(false)
const selectedUser = ref<UsuarioInterface | null>(null)
const notify = useToastNotify()

const openCreate = () => {
  selectedUser.value = null
  modalCreate.value = true
}

const editUser = (user: UsuarioInterface) => {
  selectedUser.value = user
  modalEdit.value = true
}

const confirmDelete = async (usuario: UsuarioInterface) => {
  const confirmed = await show(
    `¿Deseas eliminar a ${usuario.fullname}?`,
    'warning'
  )
  if (!confirmed) return
  try {
    await deleteUser(usuario.id)
    notify.success('Usuario eliminado correctamente')
    reloadUsuarios()
  } catch (error: any) {
    notify.error(error.message)
  }
}

const reloadUsuarios = async () => {
  try {
    const response = await getUsers()
    usuarios.value = response
  } catch (error: any) {
    notify.error(error.message)
  }
}

onMounted(() => {
  reloadUsuarios()
})
</script>

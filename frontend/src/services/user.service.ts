import api from '@/plugins/axios'
import type { UsuarioInterface } from '@/interfaces'

export const getAll = async (): Promise<UsuarioInterface[]> => {
  try {
    const response = await api.get('/users')
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al obtener usuarios')
  }
}

export const getById = async (id: string): Promise<UsuarioInterface> => {
  try {
    const response = await api.get(`/users/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al obtener el usuario'
    )
  }
}

export const create = async (data: FormData): Promise<UsuarioInterface> => {
  try {
    const response = await api.post('/users', data)
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al crear el usuario')
  }
}

export const update = async (
  id: string,
  data: FormData
): Promise<UsuarioInterface> => {
  try {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al actualizar el usuario'
    )
  }
}

export const remove = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`)
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al eliminar el usuario'
    )
  }
}

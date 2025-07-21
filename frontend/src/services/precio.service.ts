import api from '@/plugins/axios'
import type { PrecioInterface } from '@/interfaces'

export const getAll = async (): Promise<PrecioInterface[]> => {
  try {
    const response = await api.get('/precio')
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al obtener precios')
  }
}

export const getById = async (id: string): Promise<PrecioInterface> => {
  try {
    const response = await api.get(`/precio/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al obtener el precio'
    )
  }
}

export const create = async (
  data: PrecioInterface
): Promise<PrecioInterface> => {
  try {
    const response = await api.post('/precio', data)
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al crear el precio')
  }
}

export const update = async (
  id: string,
  data: PrecioInterface
): Promise<PrecioInterface> => {
  try {
    const response = await api.put(`/precio/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al actualizar el precio'
    )
  }
}

export const remove = async (id: string): Promise<void> => {
  try {
    await api.delete(`/precio/${id}`)
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al eliminar el precio'
    )
  }
}

import api from '@/plugins/axios'
import type {
  CrearEventoInterface,
  EditarEventoInterface,
  EventoInterface,
} from '@/interfaces'
import { TipoEvento } from '@/dtos'

export const getAll = async (
  fecha?: string,
  tipo?: TipoEvento
): Promise<EventoInterface[]> => {
  try {
    const params: any = { tipo: tipo ?? null, fecha: fecha ?? null }
    const response = await api.get('/evento', { params })
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al obtener eventos')
  }
}

export const getById = async (id: string): Promise<EventoInterface> => {
  try {
    const response = await api.get(`/evento/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al obtener el evento'
    )
  }
}

export const create = async (
  data: CrearEventoInterface
): Promise<EventoInterface> => {
  try {
    const response = await api.post('/evento', data)
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al crear el evento')
  }
}

export const update = async (
  id: string,
  data: EditarEventoInterface
): Promise<EventoInterface> => {
  try {
    const response = await api.put(`/evento/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al actualizar el evento'
    )
  }
}

export const remove = async (id: string): Promise<void> => {
  try {
    await api.delete(`/evento/${id}`)
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al eliminar el evento'
    )
  }
}

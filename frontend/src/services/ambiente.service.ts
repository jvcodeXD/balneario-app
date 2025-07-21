import api from '@/plugins/axios'
import type {
  AmbienteInterface,
  EstadoAmbiente,
  TipoAmbiente,
} from '@/interfaces'

export const getAll = async (
  estado?: EstadoAmbiente,
  tipo?: TipoAmbiente,
  nombre?: string
): Promise<AmbienteInterface[]> => {
  try {
    const params: any = {
      estado: estado ?? null,
      tipo: tipo ?? null,
      nombre: nombre ?? null,
    }
    const response = await api.get('/ambiente', { params })
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al obtener ambientes'
    )
  }
}

export const getById = async (id: string): Promise<AmbienteInterface> => {
  try {
    const response = await api.get(`/ambiente/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al obtener el ambiente'
    )
  }
}

export const create = async (
  data: AmbienteInterface
): Promise<AmbienteInterface> => {
  try {
    const response = await api.post('/ambiente', data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al crear el ambiente'
    )
  }
}

export const update = async (
  id: string,
  data: AmbienteInterface
): Promise<AmbienteInterface> => {
  try {
    const response = await api.put(`/ambiente/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al actualizar el ambiente'
    )
  }
}

export const remove = async (id: string): Promise<void> => {
  try {
    await api.delete(`/ambiente/${id}`)
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al eliminar el ambiente'
    )
  }
}

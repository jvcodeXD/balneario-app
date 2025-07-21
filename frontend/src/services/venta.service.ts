import api from '@/plugins/axios'
import type {
  CrearVentaInterface,
  PiscinaInterface,
  TipoAmbiente,
  UpdateVentaInterface,
  VentaInterface,
  VentaTipo,
} from '@/interfaces'

export const getAll = async (
  tipo: TipoAmbiente,
  fecha?: string
): Promise<VentaInterface[]> => {
  try {
    const params: any = {
      tipo: tipo ?? null,
      fecha: fecha ?? null,
    }
    const response = await api.get('/venta', { params })
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al obtener ventas')
  }
}

export const getByFecha = async (
  fecha: string,
  tipo?: TipoAmbiente
): Promise<any[]> => {
  try {
    const params: any = {
      fecha: fecha ?? null,
      tipo: tipo ?? null,
    }
    const response = await api.get('/venta/by-fecha', { params })
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al obtener ventas por fecha'
    )
  }
}

export const getById = async (id: string): Promise<VentaInterface> => {
  try {
    const response = await api.get(`/venta/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al obtener la venta')
  }
}

export const create = async (
  data: CrearVentaInterface
): Promise<VentaInterface> => {
  try {
    const response = await api.post('/venta', data)
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al crear la venta')
  }
}

export const update = async (
  id: string,
  data: UpdateVentaInterface
): Promise<VentaInterface> => {
  try {
    const response = await api.put(`/venta/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al actualizar la venta'
    )
  }
}

export const remove = async (id: string): Promise<void> => {
  try {
    await api.delete(`/venta/${id}`)
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al eliminar la venta'
    )
  }
}

export const imprimir = async (codigo: number): Promise<void> => {
  try {
    const response = await api.get(`recibo/${codigo}`, {
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al generar el recibo'
    )
  }
}

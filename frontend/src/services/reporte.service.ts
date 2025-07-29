import { ReporteUsuarioInterface } from '@/interfaces'
import api from '@/plugins/axios'

export const reporteDiarioUsuario = async (
  data: ReporteUsuarioInterface
): Promise<any> => {
  try {
    const response = await api.post('/reporte/diario', data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al obtener reporte diario'
    )
  }
}

export const reporteVentasTipoAmbiente = async (data: any): Promise<any> => {
  try {
    const response = await api.post('/reporte/ventas/tipo-ambiente', data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al obtener reporte de ventas'
    )
  }
}

export const reporteIngresoUsuarios = async (data: any): Promise<any> => {
  try {
    const response = await api.post('/reporte/usuarios', data)
    return response.data
  } catch (error: any) {
    error?.response?.data?.error ||
      'Error al obtener reporte de ingresos de usuario'
  }
}

export const reporteAmbientes = async (data: any): Promise<any> => {
  try {
    const response = await api.post('/reporte/ambientes-usados', data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Error al obtener reporte de ambientes'
    )
  }
}

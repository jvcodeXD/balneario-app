import {
  reporteAmbientesPDF,
  reporteDiarioUsuarioPDF,
  reporteVentasUsuarios
} from './pdf.service'
import { UserService, VentaService, AmbienteService } from '.'
import { Response } from 'express'
import { DatosAmbientePDF } from '../dtos'

export class ReporteService {
  private userService: UserService
  private ventaService: VentaService
  private ambienteService: AmbienteService

  constructor() {
    this.userService = new UserService()
    this.ventaService = new VentaService()
    this.ambienteService = new AmbienteService()
  }

  reporteDiarioUsuario = async (
    fechaInicio: Date,
    fechaFin: Date,
    idUsuario: string
  ) => {
    const usuario = await this.userService.getById(idUsuario)
    const ventas = await this.ventaService.getVentasByUsuario(
      fechaInicio,
      fechaFin,
      idUsuario
    )
    return {
      usuario,
      ventas
    }
  }

  reporteDiarioUsuarioPDF = async (
    res: Response,
    fechaInicio: Date,
    fechaFin: Date,
    idUsuario: string
  ) => {
    const ventas = await this.ventaService.getVentasByUsuario(
      fechaInicio,
      fechaFin,
      idUsuario
    )
    reporteDiarioUsuarioPDF(res, idUsuario, ventas, fechaInicio, fechaFin)
  }

  reporteVentasTipoAmbiente = async (fechaInicio: Date, fechaFin: Date) => {
    return await this.ventaService.reporteVentasTipoAmbiente(
      fechaInicio,
      fechaFin
    )
  }

  reporteIngresoUsuarios = async (fechaInicio: Date, fechaFin: Date) => {
    return await this.ventaService.reporteVentasUsuario(fechaInicio, fechaFin)
  }

  reporteIngresoUsuariosPDF = async (
    res: Response,
    fechaInicio: Date,
    fechaFin: Date
  ) => {
    const ventas = await this.ventaService.reporteVentasUsuario(
      fechaInicio,
      fechaFin
    )

    // Agrupado por fecha
    const agrupado: Record<string, any[]> = {}
    ventas.forEach((v) => {
      const fecha = new Date(v.fecha).toISOString().split('T')[0] // yyyy-MM-dd
      if (!agrupado[fecha]) agrupado[fecha] = []
      agrupado[fecha].push({
        usuario_id: v.usuario_id,
        fullname: v.fullname,
        cantidad_ventas: v.cantidad_ventas,
        total_ventas: v.total_ventas
      })
    })

    // Resumen General
    const resumen: Record<
      string,
      { fullname: string; cantidad_ventas: number; total_ventas: number }
    > = {}
    ventas.forEach((v) => {
      if (!resumen[v.usuario_id]) {
        resumen[v.usuario_id] = {
          fullname: v.fullname,
          cantidad_ventas: 0,
          total_ventas: 0
        }
      }
      resumen[v.usuario_id].cantidad_ventas += v.cantidad_ventas
      resumen[v.usuario_id].total_ventas += v.total_ventas
    })

    // Preparas todo en un solo objeto
    const datosFormateados = {
      rango: {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      },
      agrupado,
      resumen: Object.values(resumen)
    }

    // Envías los datos al generador del PDF
    reporteVentasUsuarios(res, datosFormateados)
  }

  reporteAmbientesUsados = async (fechaInicio: Date, fechaFin: Date) => {
    const reporte = await this.ventaService.reporteAmbientesUsados(
      fechaInicio,
      fechaFin
    )
    return reporte
  }

  reporteAmbientes = async (fechaInicio: Date, fechaFin: Date) => {
    const reporte = await this.ambienteService.getReporteAmbiente(
      fechaInicio,
      fechaFin
    )
    return reporte
  }

  reporteAmbientesPDF = async (
    res: Response,
    fechaInicio: Date,
    fechaFin: Date
  ) => {
    const response = await this.ambienteService.getReporteAmbiente(
      fechaInicio,
      fechaFin
    )
    const reporte: DatosAmbientePDF = {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      datos: response.map((ambiente) => ({
        id: ambiente.id,
        nombre: ambiente.nombre,
        tipo: ambiente.tipo,
        uso: ambiente.uso,
        horas_uso: ambiente.horas_uso,
        total_generado: ambiente.total_generado
      }))
    }
    reporteAmbientesPDF(res, reporte)
  }

  reporteUso = async (fechaInicio: string, fechaFin: string) => {
    return await this.ventaService.getVentasByFechaHora(fechaInicio, fechaFin)
  }
}

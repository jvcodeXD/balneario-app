import {
  AmbienteRepository,
  EventoRepository,
  VentaRepository
} from '../repositories'
import { Venta } from '../entities'
import { TipoAmbiente, TipoEvento, TipoVenta } from '../dtos'

export class VentaService {
  private ventaRepository: VentaRepository
  private ambienteRepository: AmbienteRepository
  private eventoRepository: EventoRepository

  constructor() {
    this.ventaRepository = new VentaRepository()
    this.ambienteRepository = new AmbienteRepository()
    this.eventoRepository = new EventoRepository()
  }

  private conflictosConEventos = async (
    hora_inicio: Date,
    hora_fin: Date,
    ambienteId: string
  ) => {
    const filtros: any = {}
    const eventos = await this.eventoRepository.getAll(filtros) // Puedes adaptar esto según cómo consultes eventos
    const conflictos = []

    for (const evento of eventos) {
      const eventoEsHoy =
        evento.tipo === 'DIARIO' ||
        (evento.tipo === 'UNICO' &&
          new Date(evento.fecha).toDateString() === hora_inicio.toDateString())

      const aplicaAlAmbiente = evento.ambientes?.some(
        (amb: any) => amb.id === ambienteId
      )

      if (eventoEsHoy && aplicaAlAmbiente) {
        const diario = evento.tipo === TipoEvento.DIARIO
        const inicioEvento = new Date(diario ? hora_inicio : evento.hora_inicio)
        const finEvento = new Date(diario ? hora_fin : evento.hora_fin)
        const [h, m] = evento.hora_inicio.split(':')
        inicioEvento.setHours(Number(h), Number(m))
        const [hf, mf] = evento.hora_fin.split(':')
        finEvento.setHours(Number(hf), Number(mf))

        const haySolapamiento =
          hora_inicio < finEvento && hora_fin > inicioEvento

        if (haySolapamiento) {
          conflictos.push(evento)
        }
      }
    }

    if (conflictos.length > 0) {
      throw new Error(
        'Existe un evento registrado en este horario para este ambiente.'
      )
    }
  }

  private conflictosConVentas = async (
    ambienteId: string,
    hora_inicio: Date,
    hora_fin: Date
  ): Promise<void> => {
    const ahora = new Date()

    const conflictos = await this.ventaRepository.getConflictos(
      ambienteId,
      hora_inicio,
      hora_fin
    )

    for (const conflicto of conflictos) {
      const esReserva = conflicto.tipo === 'RESERVADA'
      const minutosDesdeInicio =
        (ahora.getTime() - new Date(conflicto.hora_inicio).getTime()) / 60000

      if (esReserva && minutosDesdeInicio >= 5) {
        await this.ventaRepository.update(conflicto.id, {
          tipo: TipoVenta.CANCELADA
        })
      } else {
        throw new Error(
          'Ya existe una venta o reserva en este horario para este ambiente.'
        )
      }
    }
  }

  create = async (data: Partial<Venta>) => {
    const ahora = new Date()
    const fechaInicio = new Date(data.hora_inicio!)
    const fechaFin = new Date(data.hora_fin!)

    const ambiente = await this.ambienteRepository.findOne({
      id: data.ambiente_id!
    })
    if (ambiente && ambiente.tipo !== TipoAmbiente.SAUNA_MIXTO) {
      if (fechaFin <= ahora) {
        throw new Error('La hora de finalización ya ha pasado.')
      }

      await this.conflictosConVentas(data.ambiente_id!, fechaInicio, fechaFin)
      await this.conflictosConEventos(fechaInicio, fechaFin, data.ambiente_id!)
    }

    return await this.ventaRepository.create(data)
  }

  getAll = async (filtros: any) => {
    return await this.ventaRepository.getAll(filtros)
  }

  getById = async (id: string) => {
    const venta = await this.ventaRepository.getById(id)
    if (!venta) return null

    return venta
  }

  update = async (id: string, data: Partial<Venta>) => {
    if (data.tipo === TipoVenta.CANCELADA || data.tipo === TipoVenta.RESTANTE) {
      return await this.ventaRepository.update(id, {
        ...data
      })
    }

    const ahora = new Date()

    const fechaInicio = new Date(data.hora_inicio!)
    const fechaFin = new Date(data.hora_fin!)

    if (fechaFin <= ahora) {
      throw new Error('La hora de finalización ya ha pasado.')
    }

    // Verificar conflictos con otras ventas, excluyendo la venta actual
    const conflictos = await this.ventaRepository.getConflictosExcluyendoId(
      id,
      data.ambiente_id!,
      fechaInicio,
      fechaFin
    )

    for (const conflicto of conflictos) {
      const esReserva = conflicto.tipo === TipoVenta.RESERVADA
      const minutosDesdeInicio =
        (ahora.getTime() - new Date(conflicto.hora_inicio).getTime()) / 60000

      if (esReserva && minutosDesdeInicio >= 5) {
        await this.ventaRepository.update(conflicto.id, {
          tipo: TipoVenta.CANCELADA
        })
      } else {
        throw new Error(
          'Ya existe una venta o reserva en este horario para este ambiente.'
        )
      }
    }

    // Verificar conflictos con eventos
    await this.conflictosConEventos(fechaInicio, fechaFin, data.ambiente_id!)

    // Guardar la actualización
    return await this.ventaRepository.update(id, {
      ...data,
      updated_at: ahora
    })
  }

  delete = async (id: string) => {
    return this.ventaRepository.delete(id)
  }

  getVentasByFecha = async (fecha: string, tipo?: TipoAmbiente) => {
    return await this.ventaRepository.getVentasByFecha(fecha, tipo)
  }

  getVentasByUsuario = async (
    fechaInicio: Date,
    fechaFin: Date,
    idUsuario: string
  ) => {
    return await this.ventaRepository.getVentasByUsuario(
      fechaInicio,
      fechaFin,
      idUsuario
    )
  }

  reporteVentasTipoAmbiente = async (fechaInicio: Date, fechaFin: Date) => {
    return await this.ventaRepository.reporteVentasTipoAmbiente(
      fechaInicio,
      fechaFin
    )
  }

  reporteVentasUsuario = async (fechaInicio: Date, fechaFin: Date) => {
    const reporte = await this.ventaRepository.reporteVentasUsuario(
      fechaInicio,
      fechaFin
    )
    return reporte
  }

  reporteAmbientesUsados = async (fechaInicio: Date, fechaFin: Date) => {
    const reporte = await this.ventaRepository.reporteAmbientesUsados(
      fechaInicio,
      fechaFin
    )
    return reporte
  }

  getVentasRango = async (inicio: string, fin: string) => {
    return await this.ventaRepository.getVentasRango(inicio, fin)
  }
}

import { Repository } from 'typeorm'
import { AppDataSource } from '../../config'
import { Ambiente } from '../entities'

export class AmbienteRepository {
  private repository: Repository<Ambiente>

  constructor() {
    this.repository = AppDataSource.getRepository(Ambiente)
  }

  create = async (data: Partial<Ambiente>) => {
    const ambiente = this.repository.create(data)
    return await this.repository.save(ambiente)
  }

  getAll = async (filtros: Partial<Ambiente>) => {
    const where: any = {
      deleted_at: null
    }
    if (filtros.tipo) {
      where.tipo = filtros.tipo
    }
    if (filtros.estado) {
      where.estado = filtros.estado
    }
    if (filtros.nombre) {
      where.nombre = filtros.nombre
    }

    return await this.repository.find({
      where,
      relations: ['precio'],
      order: {
        nombre: 'ASC'
      }
    })
  }

  getById = async (id: string) => {
    return await this.repository.findOne({
      where: { id },
      relations: ['precio']
    })
  }

  update = async (id: string, data: Partial<Ambiente>) => {
    const ambiente = await this.repository.findOne({
      where: { id }
    })
    if (!ambiente) return null
    Object.assign(ambiente, data)
    return await this.repository.save(ambiente)
  }

  delete = async (id: string) => {
    const ambiente = await this.getById(id)
    if (!ambiente) return false
    await this.repository.softRemove(ambiente)
    return true
  }

  findOne = async (where: Partial<Ambiente>) => {
    return await this.repository.findOne({
      where: { ...where }
    })
  }

  getReporteAmbiente = async (fechaInicio: Date, fechaFin: Date) => {
    const query = this.repository
      .createQueryBuilder('ambiente')
      .leftJoin('ambiente.ventas', 'venta')
      .select('ambiente.id', 'id')
      .addSelect('ambiente.nombre', 'nombre')
      .addSelect('ambiente.tipo', 'tipo')
      .addSelect('COUNT(venta.id)', 'uso')
      .addSelect('COALESCE(SUM(venta.precio_total), 0)', 'total_generado')
      .addSelect(
        `COALESCE(SUM(EXTRACT(EPOCH FROM (venta.hora_fin - venta.hora_inicio)) / 3600), 0)`,
        'horas_uso'
      )
      .where('ambiente.deleted_at IS NULL')
      .andWhere('venta.deleted_at IS NULL')
      .andWhere('venta.created_at BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      })
      .groupBy('ambiente.id')
      .orderBy('total_generado', 'DESC') // 👈 Aquí se ordena por el alias

    return await query.getRawMany()
  }
}

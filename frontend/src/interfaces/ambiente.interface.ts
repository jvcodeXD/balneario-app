import { PrecioInterface } from './precio.interface'

export enum TipoAmbiente {
  SAUNA = 'SAUNA',
  FAMILIAR = 'FAMILIAR',
  INDIVIDUAL = 'INDIVIDUAL',
  SAUNA_MIXTO = 'SAUNA_MIXTO',
}

export enum EstadoAmbiente {
  HABILITADO = 'HABILITADO',
  INHABILITADO = 'INHABILITADO',
}

export interface AmbienteInterface {
  id?: string
  tipo: TipoAmbiente
  estado: EstadoAmbiente
  nombre: string
  precio_id: string
  precio?: PrecioInterface
}

export interface AmbienteReporte {
  id: string
  nombre: string
  tipo: string
  uso: number
  horas_uso: number
  total_generado: number
}

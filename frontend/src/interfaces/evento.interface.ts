import { AmbienteInterface } from './ambiente.interface'

export interface EventoInterface {
  id: string
  nombre: string
  descripcion: string
  fecha?: Date | null
  hora_inicio: string
  hora_fin: string
  tipo: string
  activo: boolean
  ambientes: AmbienteInterface[]
}

export type CrearEventoInterface = Omit<
  EventoInterface,
  'id' | 'activo' | 'ambientes'
> & {
  ambientes: string[]
}

export type EditarEventoInterface = CrearEventoInterface & {
  id: string | null
}

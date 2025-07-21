import { TipoAmbiente } from './ambiente.interface'

export interface PiscinaInterface {
  id?: string
  ambiente_id: string
  tipo_ambiente: TipoAmbiente
  nombre_ambiente: string
  cantidad: number
}

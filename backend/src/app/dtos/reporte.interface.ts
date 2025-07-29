export interface DatosAmbientePDF {
  fecha_inicio: Date
  fecha_fin: Date
  datos: DatosAmbiente[]
}

export interface DatosAmbiente {
  nombre: string
  tipo: string
  uso: number
  horas_uso: number
  total_generado: number
}

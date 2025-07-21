import { VentaTipo } from '@/interfaces'

export const obtenerIcono = (estado: VentaTipo | string) => {
  switch (estado) {
    case VentaTipo.INMEDIATA:
      return 'mdi-timer-sand'
    case VentaTipo.RESERVADA:
      return 'mdi-calendar-check'
    default:
      return 'mdi-check-circle'
  }
}

export const obtenerColorVisual = (estadoVisual: string, tipo?: string) => {
  if (estadoVisual === 'esperando') {
    return tipo === VentaTipo.RESERVADA ? 'orange-lighten-4' : 'grey-lighten-3'
  }

  switch (estadoVisual) {
    case 'enCurso':
      return 'blue-lighten-4'
    case 'porFinalizar':
      return 'red-lighten-4'
    case 'finalizado':
      return 'grey'
    default:
      return 'grey'
  }
}

export const obtenerTiempoRestante = (
  start: string | Date,
  end: string | Date
): string => {
  const ahora = new Date()
  const inicio = new Date(start)
  const fin = new Date(end)

  if (ahora < inicio) return 'Aún no inicia'
  if (ahora >= fin) return 'Finalizado'

  const diffMs = fin.getTime() - ahora.getTime()
  const minutos = Math.floor(diffMs / 60000)
  const horas = Math.floor(minutos / 60)
  const minutosRestantes = minutos % 60

  return horas > 0
    ? `${horas}h ${minutosRestantes}min restantes`
    : `${minutosRestantes}min restantes`
}

export const actualizarEstadoVisualEventos = (eventos: any[]) => {
  const ahora = new Date()
  eventos.forEach(event => {
    const inicio = new Date(event.start)
    const fin = new Date(event.end)

    if (ahora < inicio) {
      event.estadoVisual = 'esperando'
    } else if (ahora <= fin) {
      const minutosRestantes = Math.floor(
        (fin.getTime() - ahora.getTime()) / 60000
      )
      // cambiar color 15 minutos antes de finalizar
      event.estadoVisual = minutosRestantes <= 15 ? 'porFinalizar' : 'enCurso'
    } else {
      event.estadoVisual = 'finalizado'
    }
  })
}

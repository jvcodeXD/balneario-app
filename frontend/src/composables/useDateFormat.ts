type DateFormatKey =
  | 'HH:MM'
  | 'HH:MM AM/PM'
  | 'DD-MM-YYYY'
  | 'YYYY-MM-DD'
  | 'DD/MM/YYYY'
  | 'MM/DD/YYYY'
  | 'DD-MM-YYYY HH:MM'
  | 'YYYY-MM-DD HH:MM'
  | 'DD/MM/YYYY HH:MM'
  | 'MM/DD/YYYY HH:MM'
  | 'DD-MM-YYYY HH:MM AM/PM'
  | 'YYYY-MM-DD HH:MM AM/PM'

export const useDateFormat = () => {
  const formatFechaHora = (fecha: any, formato: DateFormatKey | string = 'DD-MM-YYYY HH:MM') => {
    const fechaActual = new Date(fecha)
    const dia = String(fechaActual.getDate()).padStart(2, '0')
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0')
    const anio = fechaActual.getFullYear()
    let hora = String(fechaActual.getHours()).padStart(2, '0')
    const minuto = String(fechaActual.getMinutes()).padStart(2, '0')

    // Formato de 12 horas (AM/PM)
    let periodo = ''
    if (formato.includes('AM/PM')) {
      periodo = Number(hora) >= 12 ? 'PM' : 'AM'
      hora = String(Number(hora) % 12 || 12).padStart(2, '0')
    }

    // Opciones de formato
    const formatos: Record<DateFormatKey, string> = {
      'HH:MM': `${hora}:${minuto}`,
      'HH:MM AM/PM': `${hora}:${minuto} ${periodo}`,
      'DD-MM-YYYY': `${dia}-${mes}-${anio}`,
      'YYYY-MM-DD': `${anio}-${mes}-${dia}`,
      'DD/MM/YYYY': `${dia}/${mes}/${anio}`,
      'MM/DD/YYYY': `${mes}/${dia}/${anio}`,
      'DD-MM-YYYY HH:MM': `${dia}-${mes}-${anio} ${hora}:${minuto}`,
      'YYYY-MM-DD HH:MM': `${anio}-${mes}-${dia} ${hora}:${minuto}`,
      'DD/MM/YYYY HH:MM': `${dia}/${mes}/${anio} ${hora}:${minuto}`,
      'MM/DD/YYYY HH:MM': `${mes}/${dia}/${anio} ${hora}:${minuto}`,
      'DD-MM-YYYY HH:MM AM/PM': `${dia}-${mes}-${anio} ${hora}:${minuto} ${periodo}`,
      'YYYY-MM-DD HH:MM AM/PM': `${anio}-${mes}-${dia} ${hora}:${minuto} ${periodo}`,
    }

    // Retornar el formato seleccionado o uno predeterminado
    return formatos[formato as DateFormatKey] || formatos['DD-MM-YYYY HH:MM']
  }

  return { formatFechaHora }
}

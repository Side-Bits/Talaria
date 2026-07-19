export function formatTravelDates (start: string, end: string) {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', timeZone: 'UTC' }

  const startStr = formatDateString(start, options)
  const endStr = formatDateString(end, options)

  return startStr === endStr ? `${startStr}` : `${startStr} a ${endStr}`
}

export function formatActivityDates (start: string, end: string) {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }
  
  const startStr = formatTimeString(start, options)
  const endStr = formatTimeString(end, options)
  
  return startStr === endStr ? `${startStr}` : `${startStr} a ${endStr}`
}

function formatDateString (date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString('es-ES', options)
}

function formatTimeString (date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleTimeString('es-ES', options)
}
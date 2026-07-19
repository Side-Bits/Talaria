export function formatTravelDates (start: string, end: string) {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long' }
  const startStr = new Date(start).toLocaleDateString('es-ES', options)
  const endStr = new Date(end).toLocaleDateString('es-ES', options)

  return `${startStr} a ${endStr}`
}
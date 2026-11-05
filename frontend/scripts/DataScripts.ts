const locale = 'en-US'

const date_option_short: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', timeZone: 'UTC', }
const date_option_long: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', timeZone: 'UTC', }
const time_option: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC', }

export function getDefaultDate () {
  return new Date().toISOString().slice(0, 10)
}

export function getDefaultTime () {
  return new Date().toISOString().slice(11, 16)
}

export function formatDate(date: string) {
  return formatDateString(date, date_option_long)
}

export function formatTravelDates (start: string, end: string) {
  const startStr = formatDateString(start, date_option_long)
  const endStr = formatDateString(end, date_option_long)

  return startStr === endStr ? `${startStr}` : `${startStr} to ${endStr}`
}

export function formatActivityDates (start: string, end: string) {
  const startTime = formatTimeString(start, time_option)
  const endTime = formatTimeString(end, time_option)

  if (start.slice(0, 10) === end.slice(0, 10)) {
    return startTime === endTime ? startTime : `${startTime} to ${endTime}`
  }

  const startDateStr = formatDateString(start, date_option_short)
  const endDateStr = formatDateString(end, date_option_short)

  return `${startDateStr}, ${startTime} to ${endDateStr}, ${endTime}`
}

export function formatDateString (date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString(locale, options)
}

function formatTimeString (date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleTimeString(locale, options)
}
import { ParseError } from "./errors"
import { normalizeFullWidthNumbers } from "./text"

/** Return current time as `mmss` */
export function getMmss(): string {
  const now = new Date()
  return `${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`
}

/**
 * Split a `Date` into the calendar year/month/day it falls on in JST, regardless of the host's time zone.
 * `month` is 1-based, matching the filters.
 */
export function getDatePartsJst(date: Date): { year: number; month: number; day: number } {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return { year: jst.getUTCFullYear(), month: jst.getUTCMonth() + 1, day: jst.getUTCDate() }
}

/**
 * Parse the date portion (`YYYY-MM-DD`, `YYYY/MM/DD`, or `YYYY.MM.DD`) of a string into a JST-midnight `Date`.
 * Full-width digits are normalized first.
 */
export function parseDateJst(text: string): Date {
  const match = normalizeFullWidthNumbers(text).match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (match === null) throw new ParseError(`Cannot parse date: ${text}`)

  return parseDatetimeJst(`${match[1]}/${match[2]}/${match[3]}`)
}

/** Parse JST datetime string into `Date` */
export function parseDatetimeJst(str: string): Date {
  const match = str.match(
    /^(\d{4})[/.]\s*(\d{1,2})[/.]\s*(\d{1,2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  )
  if (match === null) throw new ParseError(`Cannot parse datetime: ${str}`)

  const [, year, month, day, hour = "0", minute = "0", second = "0"] = match
  const iso = `${year}-${month!.padStart(2, "0")}-${day!.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}+09:00`
  return new Date(iso)
}

import { parseDatetimeJst } from "../shared/datetime"
import { ParseError } from "../shared/errors"
import type { ScheduleFilter } from "./_types"

/** Format a year/month into a site `dy=` query value (`YYYYMM`) */
export function formatScheduleDy(filter: ScheduleFilter): string {
  return `${filter.year}${String(filter.month).padStart(2, "0")}`
}

/** Parse the date portion (`YYYY-MM-DD`, `YYYY/MM/DD`, or `YYYY.MM.DD`) of a string into a JST-midnight `Date` */
export function parseScheduleDate(text: string): Date {
  const match = text.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (match === null) throw new ParseError(`Cannot parse date: ${text}`)

  return parseDatetimeJst(`${match[1]}/${match[2]}/${match[3]}`)
}

/** Normalize a single `H:mm`/`HH:mm` time to zero-padded `HH:mm`; returns `undefined` for blank or unparseable input */
export function normalizeTime(time: string): string | undefined {
  const match = time.trim().match(/(\d{1,2})\s*[:：]\s*(\d{2})/)
  if (match === null) return undefined

  return `${match[1]!.padStart(2, "0")}:${match[2]}`
}

/**
 * Parse a time range like `"22:00"`, `"22:00～23:30"`, or `"9:00 - 10:00"` into start/end times.
 * Accepts full-width digits/colons and any common range separator.
 */
export function parseScheduleTimeRange(text: string): {
  timeStart?: string
  timeEnd?: string
} {
  const match = text
    .trim()
    .match(/(\d{1,2}\s*[:：]\s*\d{2})\s*(?:[-–—~〜～]\s*(\d{1,2}\s*[:：]\s*\d{2}))?/)
  if (match === null) return {}

  return {
    timeStart: normalizeTime(match[1]!),
    timeEnd: match[2] !== undefined ? normalizeTime(match[2]) : undefined
  }
}

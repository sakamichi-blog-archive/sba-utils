import { parseDatetimeJst } from "../shared/datetime"
import { ParseError } from "../shared/errors"
import { normalizeFullWidthNumbers } from "../shared/text"
import type { ScheduleFilter } from "./_types"

/** Format a year/month (and optional day) into a site `dy=` query value (`YYYYMM` or `YYYYMMDD`) */
export function formatScheduleDy(filter: ScheduleFilter & { day?: number }): string {
  let dy = `${filter.year}${String(filter.month).padStart(2, "0")}`
  if (filter.day !== undefined) dy += String(filter.day).padStart(2, "0")
  return dy
}

/**
 * Resolve a category label from an element's `class` attribute by matching a whole
 * `${prefix}${key}` token (e.g. `category_media`, `cate-event`) against `categories`.
 */
export function resolveCategoryFromClass(
  classAttr: string,
  prefix: string,
  categories: Record<string, string>
): string | undefined {
  const tokens = classAttr.split(/\s+/)
  for (const key in categories) {
    if (tokens.includes(`${prefix}${key}`)) return categories[key]
  }
  return undefined
}

/**
 * Parse the date portion (`YYYY-MM-DD`, `YYYY/MM/DD`, or `YYYY.MM.DD`) of a string into a JST-midnight `Date`.
 * Full-width digits are normalized first.
 */
export function parseScheduleDate(text: string): Date {
  const match = normalizeFullWidthNumbers(text).match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (match === null) throw new ParseError(`Cannot parse date: ${text}`)

  return parseDatetimeJst(`${match[1]}/${match[2]}/${match[3]}`)
}

/**
 * Normalize a single `H:mm`/`HH:mm` time to zero-padded `HH:mm`; returns `undefined` for blank or unparseable input.
 * Full-width digits and colons are accepted.
 */
export function normalizeTime(time: string): string | undefined {
  const match = normalizeFullWidthNumbers(time.trim()).match(/(\d{1,2})\s*[:：]\s*(\d{2})/)
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
  const match = normalizeFullWidthNumbers(text.trim()).match(
    /(\d{1,2}\s*[:：]\s*\d{2})\s*(?:[-–—~〜～]\s*(\d{1,2}\s*[:：]\s*\d{2}))?/
  )
  if (match === null) return {}

  return {
    timeStart: normalizeTime(match[1]!),
    timeEnd: match[2] !== undefined ? normalizeTime(match[2]) : undefined
  }
}

import { normalizeFullWidthNumbers } from "../shared/text"

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

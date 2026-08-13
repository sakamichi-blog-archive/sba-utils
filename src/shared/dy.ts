/** Format a year/month/day into a site `dy=` query value (`YYYY`, `YYYYMM`, or `YYYYMMDD`) */
export function formatDy(filter: { year: number; month?: number; day?: number }): string {
  const { year, month, day } = filter
  if (day !== undefined && month === undefined) {
    throw new RangeError("`month` is required when `day` is specified")
  }

  let value = String(year)
  if (month !== undefined) value += String(month).padStart(2, "0")
  if (day !== undefined) value += String(day).padStart(2, "0")

  return value
}

/** Like {@link formatDy}, but `year` may be omitted entirely (returns `undefined`); throws if `month`/`day` is given without it */
export function formatOptionalDy(filter?: {
  year?: number
  month?: number
  day?: number
}): string | undefined {
  if (filter?.year === undefined) {
    if (filter?.month !== undefined || filter?.day !== undefined) {
      throw new RangeError("`year` is required when `month` or `day` is specified")
    }

    return undefined
  }

  return formatDy({ year: filter.year, month: filter.month, day: filter.day })
}

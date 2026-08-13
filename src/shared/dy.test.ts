import { describe, expect, it } from "vitest"

import { formatDy, formatOptionalDy } from "./dy"

describe("formatDy()", () => {
  it("formats year only", () => {
    expect(formatDy({ year: 2026 })).toBe("2026")
  })

  it("formats year and month, zero-padded", () => {
    expect(formatDy({ year: 2026, month: 7 })).toBe("202607")
  })

  it("formats year, month, and day, zero-padded", () => {
    expect(formatDy({ year: 2026, month: 9, day: 1 })).toBe("20260901")
  })

  it("does not pad already double-digit month and day", () => {
    expect(formatDy({ year: 2026, month: 12, day: 25 })).toBe("20261225")
  })

  it("throws RangeError when day is given without month", () => {
    expect(() => formatDy({ year: 2026, day: 1 })).toThrow(RangeError)
  })
})

describe("formatOptionalDy()", () => {
  it("returns undefined when filter is undefined", () => {
    expect(formatOptionalDy()).toBeUndefined()
  })

  it("returns undefined when filter has no year, month, or day", () => {
    expect(formatOptionalDy({})).toBeUndefined()
  })

  it("formats when year is given", () => {
    expect(formatOptionalDy({ year: 2026, month: 7, day: 1 })).toBe("20260701")
  })

  it("throws RangeError when month is given without year", () => {
    expect(() => formatOptionalDy({ month: 7 })).toThrow(RangeError)
  })

  it("throws RangeError when day is given without year", () => {
    expect(() => formatOptionalDy({ day: 1 })).toThrow(RangeError)
  })

  it("throws RangeError when day is given without month, even with year", () => {
    expect(() => formatOptionalDy({ year: 2026, day: 1 })).toThrow(RangeError)
  })
})

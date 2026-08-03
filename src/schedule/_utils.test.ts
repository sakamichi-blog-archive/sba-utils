import { describe, expect, it } from "vitest"

import { ParseError } from "../shared/errors"
import {
  formatScheduleDy,
  normalizeTime,
  parseScheduleDate,
  parseScheduleTimeRange
} from "./_utils"

describe("formatScheduleDy()", () => {
  it("zero-pads the month", () => {
    expect(formatScheduleDy({ year: 2026, month: 8 })).toBe("202608")
  })

  it("does not pad an already double-digit month", () => {
    expect(formatScheduleDy({ year: 2026, month: 12 })).toBe("202612")
  })
})

describe("parseScheduleDate()", () => {
  it("parses a dot-separated date", () => {
    expect(parseScheduleDate("2026.08.01").toISOString()).toBe("2026-07-31T15:00:00.000Z")
  })

  it("parses a hyphen-separated date", () => {
    expect(parseScheduleDate("2026-08-01").toISOString()).toBe("2026-07-31T15:00:00.000Z")
  })

  it("parses the date portion of a string with a trailing time", () => {
    expect(parseScheduleDate("2026.08.02  22:00～23:30").toISOString()).toBe(
      "2026-08-01T15:00:00.000Z"
    )
  })

  it("throws ParseError when no date is present", () => {
    expect(() => parseScheduleDate("no date here")).toThrow(ParseError)
  })

  it("normalizes full-width digits", () => {
    expect(parseScheduleDate("２０２６.０８.０１").toISOString()).toBe("2026-07-31T15:00:00.000Z")
  })
})

describe("normalizeTime()", () => {
  it("zero-pads a single-digit hour", () => {
    expect(normalizeTime("9:30")).toBe("09:30")
  })

  it("passes through a double-digit hour", () => {
    expect(normalizeTime("22:00")).toBe("22:00")
  })

  it("returns undefined for blank input", () => {
    expect(normalizeTime("")).toBeUndefined()
  })

  it("normalizes full-width digits and colon", () => {
    expect(normalizeTime("９：３０")).toBe("09:30")
  })
})

describe("parseScheduleTimeRange()", () => {
  it("parses a single start time", () => {
    expect(parseScheduleTimeRange("22:00")).toEqual({ timeStart: "22:00", timeEnd: undefined })
  })

  it("parses an open-ended range with a full-width separator", () => {
    expect(parseScheduleTimeRange("18:00～")).toEqual({ timeStart: "18:00", timeEnd: undefined })
  })

  it("parses a full range", () => {
    expect(parseScheduleTimeRange("13:00～15:00")).toEqual({
      timeStart: "13:00",
      timeEnd: "15:00"
    })
  })

  it("parses a hyphen-separated range with single-digit hours", () => {
    expect(parseScheduleTimeRange("9:00 - 10:00")).toEqual({
      timeStart: "09:00",
      timeEnd: "10:00"
    })
  })

  it("returns an empty object when there is no time", () => {
    expect(parseScheduleTimeRange("")).toEqual({})
  })

  it("parses a full-width range", () => {
    expect(parseScheduleTimeRange("２２：００～２３：３０")).toEqual({
      timeStart: "22:00",
      timeEnd: "23:30"
    })
  })
})

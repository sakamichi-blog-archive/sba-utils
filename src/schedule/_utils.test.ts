import { describe, expect, it } from "vitest"

import { normalizeTime, parseScheduleTimeRange } from "./_utils"

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

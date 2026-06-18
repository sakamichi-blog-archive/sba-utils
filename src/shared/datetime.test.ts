import { describe, expect, it } from "vitest"

import { getIma, parseDatetimeJst } from "./datetime"

describe("parseDatetimeJst", () => {
  it("parses YYYY/MM/DD HH:mm:ss (nogi)", () => {
    expect(parseDatetimeJst("2024/05/15 13:30:00")).toEqual(new Date("2024-05-15T13:30:00+09:00"))
  })

  it("parses YYYY.M.D HH:mm with single-digit month and day (hinata)", () => {
    expect(parseDatetimeJst("2024.5.3 9:05")).toEqual(new Date("2024-05-03T09:05:00+09:00"))
  })

  it("parses YYYY/MM/DD HH:mm (sakura datetime)", () => {
    expect(parseDatetimeJst("2024/05/15 13:30")).toEqual(new Date("2024-05-15T13:30:00+09:00"))
  })

  it("parses YYYY/M/DD (sakura date)", () => {
    expect(parseDatetimeJst("2024/5/03")).toEqual(new Date("2024-05-03T00:00:00+09:00"))
  })
})

describe("getIma", () => {
  it("returns a 4-digit string", () => {
    expect(getIma()).toMatch(/^\d{4}$/)
  })
})

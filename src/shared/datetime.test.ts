import { describe, expect, it } from "vitest"

import { getIma, parseDatetimeJst } from "./datetime"

describe("parseDatetimeJst", () => {
  describe("nogi list", () => {
    it("parses full datetime", () => {
      expect(parseDatetimeJst("2026/06/19 18:35:30")).toEqual(new Date("2026-06-19T18:35:30+09:00"))
    })
  })

  describe("nogi single blog", () => {
    it("parses datetime without seconds", () => {
      expect(parseDatetimeJst("2026.06.07 17:18")).toEqual(new Date("2026-06-07T17:18:00+09:00"))
    })
  })

  describe("hinata list", () => {
    it.each([
      ["2026.6.3 9:05", "2026-06-03T09:05:00+09:00"],
      ["2026.6.14 11:41", "2026-06-14T11:41:00+09:00"],
      ["2026.12.14 11:41", "2026-12-14T11:41:00+09:00"]
    ])("parses %s", (input, expected) => {
      expect(parseDatetimeJst(input)).toEqual(new Date(expected))
    })
  })

  describe("hinata single blog", () => {
    it("parses datetime without seconds", () => {
      expect(parseDatetimeJst("2026.6.14 11:41")).toEqual(new Date("2026-06-14T11:41:00+09:00"))
    })
  })

  describe("sakura list", () => {
    it.each([
      ["2026/6/3", "2026-06-03T00:00:00+09:00"],
      ["2026/6/18", "2026-06-18T00:00:00+09:00"],
      ["2026/12/15", "2026-12-15T00:00:00+09:00"]
    ])("parses %s", (input, expected) => {
      expect(parseDatetimeJst(input)).toEqual(new Date(expected))
    })
  })

  describe("sakura single blog", () => {
    it("parses datetime without seconds", () => {
      expect(parseDatetimeJst("2026/06/15 19:20")).toEqual(new Date("2026-06-15T19:20:00+09:00"))
    })
  })
})

describe("getIma", () => {
  it("returns a 4-digit string", () => {
    expect(getIma()).toMatch(/^\d{4}$/)
  })
})

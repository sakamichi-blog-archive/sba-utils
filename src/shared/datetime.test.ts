import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getMmss, parseDatetimeJst } from "./datetime"
import { ParseError } from "./errors"

describe("getMmss()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns mmss of current time", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getMmss()).toBe("3456")
  })

  it("zero-pads minutes and seconds", () => {
    vi.setSystemTime(new Date("2026-06-20T12:05:07+09:00"))
    expect(getMmss()).toBe("0507")
  })
})

describe("parseDatetimeJst()", () => {
  it("Parses Hinata blog/blogs datetime format", () => {
    expect(parseDatetimeJst("2019.6.5 00:39")).toEqual(new Date("2019-06-05T00:39:00+09:00")) // https://www.hinatazaka46.com/s/official/diary/detail/30542?ima=0000&cd=member
    expect(parseDatetimeJst("2025.8.11 09:00")).toEqual(new Date("2025-08-11T09:00:00+09:00")) // https://www.hinatazaka46.com/s/official/diary/detail/61433?ima=0000&cd=member
    expect(parseDatetimeJst("2025.12.31 23:41")).toEqual(new Date("2025-12-31T23:41:00+09:00")) // https://www.hinatazaka46.com/s/official/diary/detail/67431?ima=0000&cd=member
  })

  it("Parses Nogi blogs datetime format", () => {
    expect(parseDatetimeJst("2026/06/08 00:49:16")).toEqual(new Date("2026-06-08T00:49:16+09:00")) // https://www.nogizaka46.com/s/n46/diary/detail/104632?ima=2502
    expect(parseDatetimeJst("2026/06/19 18:35:30")).toEqual(new Date("2026-06-19T18:35:30+09:00")) // https://www.nogizaka46.com/s/n46/diary/detail/104665?ima=2502
    expect(parseDatetimeJst("2025/12/31 18:38:35")).toEqual(new Date("2025-12-31T18:38:35+09:00")) // https://www.nogizaka46.com/s/n46/diary/detail/104240?ima=3451&cd=MEMBER
  })

  it("Parses Nogi blog datetime format", () => {
    expect(parseDatetimeJst("2026.06.08 00:49")).toEqual(new Date("2026-06-08T00:49:00+09:00")) // https://www.nogizaka46.com/s/n46/diary/detail/104632?ima=2502
    expect(parseDatetimeJst("2026.06.19 18:35")).toEqual(new Date("2026-06-19T18:35:00+09:00")) // https://www.nogizaka46.com/s/n46/diary/detail/104665?ima=2502
    expect(parseDatetimeJst("2025.12.31 18:38")).toEqual(new Date("2025-12-31T18:38:00+09:00")) // https://www.nogizaka46.com/s/n46/diary/detail/104240?ima=3451&cd=MEMBER
  })

  it("Parses Sakura blogs datetime format", () => {
    expect(parseDatetimeJst("2026/6/09")).toEqual(new Date("2026-06-09T00:00:00+09:00")) // https://sakurazaka46.com/s/s46/diary/detail/69717?ima=0000&cd=blog
    expect(parseDatetimeJst("2026/4/13")).toEqual(new Date("2026-04-13T00:00:00+09:00")) // https://sakurazaka46.com/s/s46/diary/detail/68923?ima=0000&cd=blog
    expect(parseDatetimeJst("2025/12/31")).toEqual(new Date("2025-12-31T00:00:00+09:00")) // https://sakurazaka46.com/s/s46/diary/detail/67425?ima=0000&cd=blog
  })

  it("Parses Sakura blog datetime format", () => {
    expect(parseDatetimeJst("2026/06/09 21:47")).toEqual(new Date("2026-06-09T21:47:00+09:00")) // https://sakurazaka46.com/s/s46/diary/detail/69717?ima=0000&cd=blog
    expect(parseDatetimeJst("2026/04/13 00:08")).toEqual(new Date("2026-04-13T00:08:00+09:00")) // https://sakurazaka46.com/s/s46/diary/detail/68923?ima=0000&cd=blog
    expect(parseDatetimeJst("2025/12/31 21:39")).toEqual(new Date("2025-12-31T21:39:00+09:00")) // https://sakurazaka46.com/s/s46/diary/detail/67425?ima=0000&cd=blog
  })

  it("throws ParseError for unexpected input", () => {
    expect(() => parseDatetimeJst("")).toThrow(ParseError)
  })
})

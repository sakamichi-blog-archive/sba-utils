import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchSakuraScheduleEvents,
  fetchSakuraScheduleEventsHtml,
  getSakuraScheduleUrl,
  parseSakuraScheduleEventsHtml
} from "./sakura"

describe("fetchSakuraScheduleEvents()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("returns parsed events on 200", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("sakura-schedule.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { events, html, url } = await fetchSakuraScheduleEvents({ year: 2026, month: 8 })
    expect(events).toHaveLength(2)
    expect(html).toBe(readFixture("sakura-schedule.html"))
    expect(url).toBe("https://sakurazaka46.com/s/s46/media/list?ima=3456&dy=202608")
  })
})

describe("fetchSakuraScheduleEventsHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchSakuraScheduleEventsHtml({ year: 2026, month: 8 })).rejects.toBeInstanceOf(
      FetchStatusError
    )
  })
})

describe("getSakuraScheduleUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("applies ima and dy params", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getSakuraScheduleUrl({ year: 2026, month: 8 })).toBe(
      "https://sakurazaka46.com/s/s46/media/list?ima=3456&dy=202608"
    )
  })
})

describe("parseSakuraScheduleEventsHtml()", () => {
  const html = readFixture("sakura-schedule.html")

  it("ignores the member-filter modal", () => {
    expect(parseSakuraScheduleEventsHtml(html)).toHaveLength(2)
  })

  it("extracts members from the detail modal", () => {
    const events = parseSakuraScheduleEventsHtml(html)
    expect(events[0]?.members).toEqual([])
    expect(events[1]?.members).toEqual(["向井純葉"])
  })

  it("parses event fields correctly", () => {
    expect(parseSakuraScheduleEventsHtml(html)).toMatchInlineSnapshot(`
      [
        {
          "category": "ライブ",
          "date": 2026-07-31T15:00:00.000Z,
          "group": "sakura",
          "html": "<a href="https://example.com/">Event detail placeholder.</a>",
          "id": "11602",
          "members": [],
          "timeEnd": undefined,
          "timeStart": undefined,
          "title": "音楽フェス出演",
        },
        {
          "category": "メディア",
          "date": 2026-08-01T15:00:00.000Z,
          "group": "sakura",
          "html": "Radio detail placeholder.",
          "id": "10472",
          "members": [
            "向井純葉",
          ],
          "timeEnd": "23:30",
          "timeStart": "22:00",
          "title": "ラジオ番組",
        },
      ]
    `)
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchNogiScheduleEvents,
  fetchNogiScheduleEventsJs,
  getNogiScheduleEventUrl,
  getNogiScheduleUrl,
  parseNogiScheduleEventsJs
} from "./nogi"

describe("fetchNogiScheduleEvents()", () => {
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
        text: vi.fn().mockResolvedValue(readFixture("nogi-schedule.jsonp")),
        body: { cancel: vi.fn() }
      })
    )
    const { events, js, url } = await fetchNogiScheduleEvents({ year: 2026, month: 8 })
    expect(events).toHaveLength(3)
    expect(js).toBe(readFixture("nogi-schedule.jsonp"))
    expect(url).toBe(
      "https://www.nogizaka46.com/s/n46/api/list/schedule?ima=3456&dy=202608&callback=res"
    )
  })
})

describe("fetchNogiScheduleEventsJs()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiScheduleEventsJs({ year: 2026, month: 8 })).rejects.toBeInstanceOf(
      FetchStatusError
    )
  })
})

describe("getNogiScheduleUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("applies ima, dy, and callback params", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getNogiScheduleUrl({ year: 2026, month: 8 })).toBe(
      "https://www.nogizaka46.com/s/n46/api/list/schedule?ima=3456&dy=202608&callback=res"
    )
  })
})

describe("getNogiScheduleEventUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("builds the detail URL from an id", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getNogiScheduleEventUrl("107136")).toBe(
      "https://www.nogizaka46.com/s/n46/media/detail/107136?ima=3456"
    )
  })
})

describe("parseNogiScheduleEventsJs()", () => {
  const js = readFixture("nogi-schedule.jsonp")

  it("throws ParseError when JS has no matching call", () => {
    expect(() => parseNogiScheduleEventsJs("other({})")).toThrow(ParseError)
  })

  it("resolves member IDs to names via the members dataset", () => {
    const [first] = parseNogiScheduleEventsJs(js)
    expect(first?.members).toEqual(["五百城茉央", "奥田いろは"])
  })

  it("exposes the key with no name when the key is in neither map", () => {
    const events = parseNogiScheduleEventsJs(js)
    expect(events[2]?.categoryKey).toBe("special")
    expect(events[2]?.categoryName).toBeUndefined()
  })

  it("resolves names from a supplied map, overriding the known categories", () => {
    const events = parseNogiScheduleEventsJs(js, { special: "特別企画" })
    expect(events[2]?.categoryName).toBe("特別企画")
  })

  it("parses event fields correctly", () => {
    expect(parseNogiScheduleEventsJs(js)).toMatchInlineSnapshot(`
      [
        {
          "categoryKey": "live",
          "categoryName": "ライブ/イベント",
          "date": 2026-07-31T15:00:00.000Z,
          "html": "<p>Event detail placeholder.</p>",
          "id": "107136",
          "members": [
            "五百城茉央",
            "奥田いろは",
          ],
          "timeEnd": undefined,
          "timeStart": undefined,
          "title": "「サマーフェスティバル2026」五百城茉央、奥田いろは",
          "url": "https://www.nogizaka46.com/s/n46/media/detail/107136?ima=2037&pri1=202608",
        },
        {
          "categoryKey": "tv",
          "categoryName": "テレビ",
          "date": 2026-08-01T15:00:00.000Z,
          "html": "<p>Broadcast detail placeholder.</p>",
          "id": "107140",
          "members": [
            "岩本蓮加",
          ],
          "timeEnd": "10:00",
          "timeStart": "09:30",
          "title": "テレビ番組「ナレーション出演」岩本蓮加",
          "url": "https://www.nogizaka46.com/s/n46/media/detail/107140?ima=2037&pri1=202608",
        },
        {
          "categoryKey": "special",
          "categoryName": undefined,
          "date": 2026-08-02T15:00:00.000Z,
          "html": "<p>Placeholder.</p>",
          "id": "107150",
          "members": [],
          "timeEnd": undefined,
          "timeStart": undefined,
          "title": "特別企画",
          "url": "https://www.nogizaka46.com/s/n46/media/detail/107150?ima=2037&pri1=202608",
        },
      ]
    `)
  })
})

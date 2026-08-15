import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchNogiScheduleCategories,
  fetchNogiScheduleEvent,
  fetchNogiScheduleEventHtml,
  fetchNogiScheduleEvents,
  fetchNogiScheduleEventsJs,
  getNogiScheduleEventUrl,
  getNogiScheduleUrl,
  parseNogiScheduleCategoriesHtml,
  parseNogiScheduleEventHtml,
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
      vi.fn().mockImplementation((requestUrl: string) => ({
        status: 200,
        text: vi
          .fn()
          .mockResolvedValue(
            readFixture(
              requestUrl.includes("/api/list/schedule")
                ? "nogi-schedule.jsonp"
                : "nogi-schedule-categories.html"
            )
          ),
        body: { cancel: vi.fn() }
      }))
    )
    const { events, js, url } = await fetchNogiScheduleEvents({ year: 2026, month: 8 })
    expect(events).toHaveLength(3)
    expect(events[0]?.categoryName).toBe("ライブ/イベント")
    expect(events[1]?.categoryName).toBe("テレビ")
    expect(js).toBe(readFixture("nogi-schedule.jsonp"))
    expect(url).toBe("https://www.nogizaka46.com/s/n46/media/list?ima=3456&dy=202608")
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

describe("fetchNogiScheduleEvent()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("returns the parsed event on 200", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("nogi-schedule-detail.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { event, url } = await fetchNogiScheduleEvent("107140")
    expect(url).toBe("https://www.nogizaka46.com/s/n46/media/detail/107140?ima=3456")
    expect(event.title).toBe("テレビ番組「ナレーション出演」岩本蓮加")
    expect(event.id).toBe("107140")
  })

  it("requests the given occurrence", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      text: vi.fn().mockResolvedValue(readFixture("nogi-schedule-detail.html")),
      body: { cancel: vi.fn() }
    })
    vi.stubGlobal("fetch", fetchMock)
    const { url } = await fetchNogiScheduleEvent("107022", new Date("2026-08-15T00:00:00+09:00"))
    expect(url).toContain("wd00=2026&wd01=08&wd02=15")
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("wd00=2026&wd01=08&wd02=15")
  })
})

describe("fetchNogiScheduleEventHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiScheduleEventHtml("107140")).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("fetchNogiScheduleCategories()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 503, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiScheduleCategories({ year: 2026, month: 8 })).rejects.toBeInstanceOf(
      FetchStatusError
    )
  })

  it("omits dy when no filter is given", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      text: vi.fn().mockResolvedValue(readFixture("nogi-schedule-categories.html")),
      body: { cancel: vi.fn() }
    })
    vi.stubGlobal("fetch", fetchMock)
    await fetchNogiScheduleCategories()
    expect(String(fetchMock.mock.calls[0]?.[0])).not.toContain("dy=")
  })

  it("returns an empty map when the nav is absent", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue("<html></html>"),
        body: { cancel: vi.fn() }
      })
    )
    await expect(fetchNogiScheduleCategories({ year: 2026, month: 8 })).resolves.toEqual({})
  })
})

describe("getNogiScheduleUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns the listing page, not the JSONP endpoint", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getNogiScheduleUrl({ year: 2026, month: 8 })).toBe(
      "https://www.nogizaka46.com/s/n46/media/list?ima=3456&dy=202608"
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

  it("adds zero-padded wd parameters for an occurrence", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getNogiScheduleEventUrl("107022", new Date("2026-08-01T00:00:00+09:00"))).toBe(
      "https://www.nogizaka46.com/s/n46/media/detail/107022?ima=3456&wd00=2026&wd01=08&wd02=01"
    )
  })

  it("splits the occurrence in JST, not the host time zone", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    // JST midnight on the 1st is 15:00 UTC on the previous day
    expect(getNogiScheduleEventUrl("107022", new Date("2026-07-31T15:00:00.000Z"))).toContain(
      "wd00=2026&wd01=08&wd02=01"
    )
  })
})

describe("parseNogiScheduleCategoriesHtml()", () => {
  it("parses the radio-input nav, skipping the ALL input", () => {
    expect(parseNogiScheduleCategoriesHtml(readFixture("nogi-schedule-categories.html"))).toEqual({
      live: "ライブ/イベント",
      meetandgreet: "ミート&グリート",
      tv: "テレビ"
    })
  })

  it("does not match the news nav markup", () => {
    expect(
      parseNogiScheduleCategoriesHtml(
        `<div class="cat_sel_list"><a data-param="ct" data-value="tv">テレビ</a></div>`
      )
    ).toEqual({})
  })

  it("returns an empty object when the nav is absent", () => {
    expect(parseNogiScheduleCategoriesHtml("<html></html>")).toEqual({})
  })
})

describe("parseNogiScheduleEventHtml()", () => {
  const url = "https://www.nogizaka46.com/s/n46/media/detail/107140?ima=3456"

  it("throws ParseError when the header is absent", () => {
    expect(() => parseNogiScheduleEventHtml("<html></html>", url)).toThrow(ParseError)
  })

  it("reads the category label off the page, without a category map", () => {
    const event = parseNogiScheduleEventHtml(readFixture("nogi-schedule-detail.html"), url)
    expect(event.categoryKey).toBe("tv")
    expect(event.categoryName).toBe("テレビ")
  })

  it("falls back to an empty categoryKey when the tag carries no `i--` class", () => {
    const event = parseNogiScheduleEventHtml(
      `<header class="m--dehd"><div class="m--dehd__tag__i"></div>
        <p class="m--dehd__tag__name">テレビ</p>
        <p class="m--pstdata__p">2026.08.01</p></header>`,
      url
    )
    expect(event.categoryKey).toBe("")
    expect(event.categoryName).toBe("テレビ")
  })

  it("leaves timeEnd undefined for an open-ended range", () => {
    const event = parseNogiScheduleEventHtml(
      `<header class="m--dehd"><p class="m--dehd__sctm">20:30～</p>
        <p class="m--pstdata__p">2026.08.01</p></header>`,
      url
    )
    expect(event.timeStart).toBe("20:30")
    expect(event.timeEnd).toBeUndefined()
  })

  it("ignores the LATEST list's date and reads the header's", () => {
    const event = parseNogiScheduleEventHtml(readFixture("nogi-schedule-detail.html"), url)
    expect(event.date.toISOString()).toBe("2026-07-31T15:00:00.000Z")
  })

  it("parses event fields correctly", () => {
    expect(parseNogiScheduleEventHtml(readFixture("nogi-schedule-detail.html"), url))
      .toMatchInlineSnapshot(`
        {
          "categoryKey": "tv",
          "categoryName": "テレビ",
          "date": 2026-07-31T15:00:00.000Z,
          "html": "<p>Broadcast detail placeholder.</p>",
          "id": "107140",
          "timeEnd": "10:00",
          "timeStart": "09:30",
          "title": "テレビ番組「ナレーション出演」岩本蓮加",
          "url": "https://www.nogizaka46.com/s/n46/media/detail/107140?ima=3456",
        }
      `)
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

  it("exposes keys with empty names when no category map is supplied", () => {
    const events = parseNogiScheduleEventsJs(js)
    expect(events[2]?.categoryKey).toBe("special")
    expect(events[2]?.categoryName).toBe("")
  })

  it("resolves names from a supplied map", () => {
    const events = parseNogiScheduleEventsJs(js, { special: "特別企画" })
    expect(events[2]?.categoryName).toBe("特別企画")
  })

  it("parses event fields correctly", () => {
    expect(parseNogiScheduleEventsJs(js)).toMatchInlineSnapshot(`
      [
        {
          "categoryKey": "live",
          "categoryName": "",
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
          "categoryName": "",
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
          "categoryName": "",
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

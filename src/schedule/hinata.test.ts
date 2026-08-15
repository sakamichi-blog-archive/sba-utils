import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchHinataScheduleEvent,
  fetchHinataScheduleEventHtml,
  fetchHinataScheduleEvents,
  fetchHinataScheduleEventsHtml,
  getHinataScheduleEventUrl,
  getHinataScheduleUrl,
  parseHinataScheduleEventHtml,
  parseHinataScheduleEventsHtml
} from "./hinata"

describe("fetchHinataScheduleEvents()", () => {
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
        text: vi.fn().mockResolvedValue(readFixture("hinata-schedule.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { events, html, url } = await fetchHinataScheduleEvents({ year: 2026, month: 8 })
    expect(events).toHaveLength(3)
    expect(html).toBe(readFixture("hinata-schedule.html"))
    expect(url).toBe("https://www.hinatazaka46.com/s/official/media/list?ima=3456&dy=202608")
  })
})

describe("fetchHinataScheduleEventsHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchHinataScheduleEventsHtml({ year: 2026, month: 8 })).rejects.toBeInstanceOf(
      FetchStatusError
    )
  })
})

describe("fetchHinataScheduleEvent()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("returns parsed event detail on 200", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("hinata-schedule-detail.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { event, url } = await fetchHinataScheduleEvent("10333")
    expect(event.members).toEqual(["佐々木久美", "金村美玖"])
    expect(url).toBe("https://www.hinatazaka46.com/s/official/media/detail/10333?ima=3456")
  })
})

describe("fetchHinataScheduleEventHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 500, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchHinataScheduleEventHtml("10333")).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("getHinataScheduleUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("applies ima and dy params", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getHinataScheduleUrl({ year: 2026, month: 8 })).toBe(
      "https://www.hinatazaka46.com/s/official/media/list?ima=3456&dy=202608"
    )
  })
})

describe("getHinataScheduleEventUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns correct URL", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getHinataScheduleEventUrl("10333")).toBe(
      "https://www.hinatazaka46.com/s/official/media/detail/10333?ima=3456"
    )
  })
})

describe("parseHinataScheduleEventsHtml()", () => {
  const html = readFixture("hinata-schedule.html")

  it("throws ParseError when year/month cannot be parsed", () => {
    expect(() => parseHinataScheduleEventsHtml("<html></html>")).toThrow(ParseError)
  })

  it("parses list events correctly", () => {
    expect(parseHinataScheduleEventsHtml(html)).toMatchInlineSnapshot(`
      [
        {
          "categoryKey": "birth",
          "categoryName": "誕生日",
          "date": 2026-07-31T15:00:00.000Z,
          "id": "10222",
          "timeEnd": undefined,
          "timeStart": undefined,
          "title": "高井 俐香の誕生日",
          "url": "https://www.hinatazaka46.com/s/official/media/detail/10222?ima=0000",
        },
        {
          "categoryKey": "media",
          "categoryName": "メディア",
          "date": 2026-07-31T15:00:00.000Z,
          "id": "10333",
          "timeEnd": undefined,
          "timeStart": "18:00",
          "title": "テレビ番組の出演",
          "url": "https://www.hinatazaka46.com/s/official/media/detail/10333?ima=0000",
        },
        {
          "categoryKey": "event",
          "categoryName": "イベント",
          "date": 2026-08-01T15:00:00.000Z,
          "id": "10444",
          "timeEnd": "15:00",
          "timeStart": "13:00",
          "title": "握手会",
          "url": "https://www.hinatazaka46.com/s/official/media/detail/10444?ima=0000",
        },
      ]
    `)
  })

  it("omits members from list events", () => {
    expect(parseHinataScheduleEventsHtml(html).every(event => !("members" in event))).toBe(true)
  })

  it("keeps an event whose displayed category label is empty, with an empty name", () => {
    const unresolvable = `
      <div class="l-maincontents--schedule">
        <p class="p-schedule__page_date">2026年 08月</p>
        <ul>
          <li class="p-schedule__list-group">
            <div class="c-schedule__date--list"><span>1</span></div>
            <ul class="p-schedule__list">
              <li class="p-schedule__item">
                <a href="/s/official/media/detail/1?ima=0000">
                  <div class="p-schedule__head">
                    <div class="c-schedule__category category_goods"></div>
                    <div class="c-schedule__time--list"></div>
                  </div>
                  <p class="c-schedule__text">グッズ販売</p>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>`
    const [event] = parseHinataScheduleEventsHtml(unresolvable)
    expect(event?.categoryKey).toBe("goods")
    expect(event?.categoryName).toBe("")
  })
})

describe("parseHinataScheduleEventHtml()", () => {
  const html = readFixture("hinata-schedule-detail.html")
  const url = "https://www.hinatazaka46.com/s/official/media/detail/10333?ima=0000"

  it("throws ParseError when article element not found", () => {
    expect(() => parseHinataScheduleEventHtml("<html></html>", url)).toThrow(ParseError)
  })

  it("returns undefined date when the detail page has none (e.g. birthdays)", () => {
    const birthday = `
      <main class="l-main"><section class="l-section"><div class="l-container"><div class="l-contents">
        <div class="l-maincontents--schedule-detail">
          <div class="p-article__info">
            <div class="c-schedule__category category_birth">誕生日</div>
            <div class="c-schedule__date"><b></b><span></span></div>
          </div>
          <h3 class="c-article__title">高井 俐香の誕生日</h3>
          <div class="c-article__tag"></div>
          <div class="p-article__text"></div>
        </div>
      </div></div></div></section></main>`
    const event = parseHinataScheduleEventHtml(
      birthday,
      "https://www.hinatazaka46.com/s/official/media/detail/10222?ima=0000"
    )
    expect(event.date).toBeUndefined()
    expect(event.categoryName).toBe("誕生日")
  })

  it("parses detail fields correctly", () => {
    expect(parseHinataScheduleEventHtml(html, url)).toMatchInlineSnapshot(`
      {
        "categoryKey": "media",
        "categoryName": "メディア",
        "date": 2026-07-31T15:00:00.000Z,
        "html": "<p>Broadcast detail placeholder.</p>",
        "id": "10333",
        "members": [
          "佐々木久美",
          "金村美玖",
        ],
        "timeEnd": "19:00",
        "timeStart": "18:00",
        "title": "テレビ番組の出演",
        "url": "https://www.hinatazaka46.com/s/official/media/detail/10333?ima=0000",
      }
    `)
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchSakuraNews,
  fetchSakuraNewsDetail,
  fetchSakuraNewsDetailHtml,
  fetchSakuraNewsHtml,
  getSakuraNewsDetailUrl,
  getSakuraNewsUrl,
  parseSakuraNewsCategoriesHtml,
  parseSakuraNewsDetailHtml,
  parseSakuraNewsHtml
} from "./sakura"

describe("fetchSakuraNews()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("returns parsed news on 200", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("sakura-news.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { news, html, url } = await fetchSakuraNews({ year: 2026, month: 6 })
    expect(news).toHaveLength(3)
    expect(html).toBe(readFixture("sakura-news.html"))
    expect(url).toBe("https://sakurazaka46.com/s/s46/news/list?ima=3456&dy=202606")
  })
})

describe("fetchSakuraNewsHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchSakuraNewsHtml({ year: 2026, month: 6 })).rejects.toBeInstanceOf(
      FetchStatusError
    )
  })

  it("throws RangeError when month is given without year", async () => {
    await expect(fetchSakuraNewsHtml({ month: 6 })).rejects.toBeInstanceOf(RangeError)
  })
})

describe("fetchSakuraNewsDetail()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("returns parsed news detail on 200", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("sakura-news-detail.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { newsDetail, url } = await fetchSakuraNewsDetail("M02129")
    expect(newsDetail.members).toEqual(["遠藤理子", "山﨑天"])
    expect(url).toBe("https://sakurazaka46.com/s/s46/news/detail/M02129?ima=3456")
  })
})

describe("fetchSakuraNewsDetailHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 500, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchSakuraNewsDetailHtml("M02129")).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("getSakuraNewsUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("applies ima and dy params", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getSakuraNewsUrl({ year: 2026, month: 6 })).toBe(
      "https://sakurazaka46.com/s/s46/news/list?ima=3456&dy=202606"
    )
  })

  it("narrows dy to a single day when day is given", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getSakuraNewsUrl({ year: 2026, month: 6, day: 30 })).toBe(
      "https://sakurazaka46.com/s/s46/news/list?ima=3456&dy=20260630"
    )
  })

  it("omits dy when no filter is given", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getSakuraNewsUrl()).toBe("https://sakurazaka46.com/s/s46/news/list?ima=3456")
  })
})

describe("getSakuraNewsDetailUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns correct URL", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getSakuraNewsDetailUrl("M02129")).toBe(
      "https://sakurazaka46.com/s/s46/news/detail/M02129?ima=3456"
    )
  })
})

describe("parseSakuraNewsHtml()", () => {
  const html = readFixture("sakura-news.html")

  it("parses news correctly, oldest first", () => {
    expect(parseSakuraNewsHtml(html)).toMatchInlineSnapshot(`
      [
        {
          "category": "グッズ",
          "date": 2026-06-04T15:00:00.000Z,
          "group": "sakura",
          "id": "G00087",
          "title": "新規グッズの販売が決定！",
          "url": "https://sakurazaka46.com/s/s46/news/detail/G00087?ima=0000",
        },
        {
          "category": "リリース",
          "date": 2026-06-09T15:00:00.000Z,
          "group": "sakura",
          "id": "R00312",
          "title": "15th Double A-side Single の特典内容が決定！",
          "url": "https://sakurazaka46.com/s/s46/news/detail/R00312?ima=0000",
        },
        {
          "category": "メディア",
          "date": 2026-06-29T15:00:00.000Z,
          "group": "sakura",
          "id": "M02129",
          "title": "「櫻坂チャンネル」にて新着動画を公開！",
          "url": "https://sakurazaka46.com/s/s46/news/detail/M02129?ima=0000",
        },
      ]
    `)
  })

  it("falls back to the category class when the visible label is empty", () => {
    expect(parseSakuraNewsHtml(html)[0]?.category).toBe("グッズ")
  })

  it("skips news with no href", () => {
    expect(parseSakuraNewsHtml(html).every(news => news.title !== "リンク切れの項目")).toBe(true)
  })

  it("returns an empty array when there is no news list", () => {
    expect(parseSakuraNewsHtml("<html></html>")).toEqual([])
  })
})

describe("parseSakuraNewsCategoriesHtml()", () => {
  it("parses the category nav, skipping the ALL and member-select links", () => {
    expect(parseSakuraNewsCategoriesHtml(readFixture("sakura-news.html"))).toEqual({
      goods: "グッズ",
      media: "メディア"
    })
  })

  it("returns an empty object when there is no category nav", () => {
    expect(parseSakuraNewsCategoriesHtml("<html></html>")).toEqual({})
  })
})

describe("parseSakuraNewsDetailHtml()", () => {
  const html = readFixture("sakura-news-detail.html")
  const url = "https://sakurazaka46.com/s/s46/news/detail/M02129?ima=0000"

  it("throws ParseError when the id cannot be extracted from the URL", () => {
    expect(() => parseSakuraNewsDetailHtml(html, "https://sakurazaka46.com/")).toThrow(ParseError)
  })

  it("throws ParseError when article element not found", () => {
    expect(() => parseSakuraNewsDetailHtml("<html></html>", url)).toThrow(ParseError)
  })

  it("parses news detail correctly", () => {
    expect(parseSakuraNewsDetailHtml(html, url)).toMatchInlineSnapshot(`
      {
        "category": "メディア",
        "date": 2026-06-29T15:00:00.000Z,
        "group": "sakura",
        "html": "ダミー本文です。<br>ぜひご覧ください。",
        "id": "M02129",
        "members": [
          "遠藤理子",
          "山﨑天",
        ],
        "title": "「櫻坂チャンネル」にて新着動画を公開！",
        "url": "https://sakurazaka46.com/s/s46/news/detail/M02129?ima=0000",
      }
    `)
  })
})

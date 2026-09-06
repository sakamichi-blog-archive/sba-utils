import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchKeyakiNews,
  fetchKeyakiNewsDetail,
  fetchKeyakiNewsDetailHtml,
  fetchKeyakiNewsHtml,
  getKeyakiNewsDetailUrl,
  getKeyakiNewsUrl,
  parseKeyakiNewsDetailHtml,
  parseKeyakiNewsHtml
} from "./keyaki"

describe("fetchKeyakiNews()", () => {
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
        text: vi.fn().mockResolvedValue(readFixture("keyaki-news.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { news, html, url } = await fetchKeyakiNews({ year: 2020, month: 10 })
    expect(news).toHaveLength(2)
    expect(html).toBe(readFixture("keyaki-news.html"))
    expect(url).toBe("https://www.keyakizaka46.com/s/k46o/news/list?ima=3456&dy=202010")
  })
})

describe("fetchKeyakiNewsHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 500, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchKeyakiNewsHtml()).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("fetchKeyakiNewsDetail()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("returns the parsed news detail on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("keyaki-news-detail.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { newsDetail } = await fetchKeyakiNewsDetail("S00399")
    expect(newsDetail.id).toBe("S00399")
    expect(newsDetail.categoryKey).toBe("shakehands")
  })
})

describe("fetchKeyakiNewsDetailHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchKeyakiNewsDetailHtml("S00399")).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("getKeyakiNewsUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("applies ima and dy params", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getKeyakiNewsUrl({ year: 2020, month: 10 })).toBe(
      "https://www.keyakizaka46.com/s/k46o/news/list?ima=3456&dy=202010"
    )
  })

  it("applies a 0-indexed page", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getKeyakiNewsUrl({ year: 2020, page: 2 })).toBe(
      "https://www.keyakizaka46.com/s/k46o/news/list?ima=3456&dy=2020&page=2"
    )
  })

  it("omits dy when no filter is given", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getKeyakiNewsUrl()).toBe("https://www.keyakizaka46.com/s/k46o/news/list?ima=3456")
  })
})

describe("getKeyakiNewsDetailUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns correct URL", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getKeyakiNewsDetailUrl("S00399")).toBe(
      "https://www.keyakizaka46.com/s/k46o/news/detail/S00399?ima=3456"
    )
  })
})

describe("parseKeyakiNewsHtml()", () => {
  const html = readFixture("keyaki-news.html")

  it("parses news correctly, oldest first", () => {
    expect(parseKeyakiNewsHtml(html)).toMatchInlineSnapshot(`
      [
        {
          "categoryKey": "media",
          "categoryName": "",
          "date": 2020-10-12T15:00:00.000Z,
          "id": "M01658",
          "title": "メディア出演情報",
          "url": "https://www.keyakizaka46.com/s/k46o/news/detail/M01658?ima=0000",
        },
        {
          "categoryKey": "shakehands",
          "categoryName": "握手会",
          "date": 2020-10-19T15:00:00.000Z,
          "id": "S00399",
          "title": "握手会に関するお知らせ",
          "url": "https://www.keyakizaka46.com/s/k46o/news/detail/S00399?ima=0000",
        },
      ]
    `)
  })

  it("keeps news whose displayed category label is empty, with an empty name", () => {
    const empty = parseKeyakiNewsHtml(html).find(news => news.categoryKey === "media")
    expect(empty?.categoryName).toBe("")
  })

  it("skips news with no href", () => {
    expect(parseKeyakiNewsHtml(html).every(news => news.title !== "リンク切れの項目")).toBe(true)
  })

  it("returns an empty array when there is no news list", () => {
    expect(parseKeyakiNewsHtml("<html></html>")).toEqual([])
  })
})

describe("parseKeyakiNewsDetailHtml()", () => {
  const html = readFixture("keyaki-news-detail.html")
  const url = "https://www.keyakizaka46.com/s/k46o/news/detail/S00399?ima=0000"

  it("throws ParseError when the id cannot be extracted from the URL", () => {
    expect(() => parseKeyakiNewsDetailHtml(html, "https://www.keyakizaka46.com/")).toThrow(
      ParseError
    )
  })

  it("throws ParseError when article element not found", () => {
    expect(() => parseKeyakiNewsDetailHtml("<html></html>", url)).toThrow(ParseError)
  })

  it("parses news detail correctly", () => {
    expect(parseKeyakiNewsDetailHtml(html, url)).toMatchInlineSnapshot(`
      {
        "categoryKey": "shakehands",
        "categoryName": "握手会",
        "date": 2020-10-19T15:00:00.000Z,
        "html": "ダミー本文です。<br>ぜひご確認ください。",
        "id": "S00399",
        "title": "握手会に関するお知らせ",
        "url": "https://www.keyakizaka46.com/s/k46o/news/detail/S00399?ima=0000",
      }
    `)
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchHinataNews,
  fetchHinataNewsDetail,
  fetchHinataNewsDetailHtml,
  fetchHinataNewsHtml,
  getHinataNewsDetailUrl,
  getHinataNewsUrl,
  parseHinataNewsCategoriesHtml,
  parseHinataNewsDetailHtml,
  parseHinataNewsHtml
} from "./hinata"

describe("fetchHinataNews()", () => {
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
        text: vi.fn().mockResolvedValue(readFixture("hinata-news.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { news, html, url } = await fetchHinataNews({ year: 2026, month: 6 })
    expect(news).toHaveLength(3)
    expect(html).toBe(readFixture("hinata-news.html"))
    expect(url).toBe("https://www.hinatazaka46.com/s/official/news/list?ima=3456&dy=202606")
  })
})

describe("fetchHinataNewsHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchHinataNewsHtml({ year: 2026, month: 6 })).rejects.toBeInstanceOf(
      FetchStatusError
    )
  })

  it("throws RangeError when month is given without year", async () => {
    await expect(fetchHinataNewsHtml({ month: 6 })).rejects.toBeInstanceOf(RangeError)
  })
})

describe("fetchHinataNewsDetail()", () => {
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
        text: vi.fn().mockResolvedValue(readFixture("hinata-news-detail.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { newsDetail, url } = await fetchHinataNewsDetail("M02742")
    expect(newsDetail.members).toEqual(["金村美玖", "山下葉留花"])
    expect(url).toBe("https://www.hinatazaka46.com/s/official/news/detail/M02742?ima=3456")
  })
})

describe("fetchHinataNewsDetailHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 500, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchHinataNewsDetailHtml("M02742")).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("getHinataNewsUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("applies ima and dy params", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getHinataNewsUrl({ year: 2026, month: 6 })).toBe(
      "https://www.hinatazaka46.com/s/official/news/list?ima=3456&dy=202606"
    )
  })

  it("narrows dy to a single day when day is given", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getHinataNewsUrl({ year: 2026, month: 6, day: 30 })).toBe(
      "https://www.hinatazaka46.com/s/official/news/list?ima=3456&dy=20260630"
    )
  })

  it("omits dy when no filter is given", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getHinataNewsUrl()).toBe("https://www.hinatazaka46.com/s/official/news/list?ima=3456")
  })
})

describe("getHinataNewsDetailUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns correct URL", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getHinataNewsDetailUrl("M02742")).toBe(
      "https://www.hinatazaka46.com/s/official/news/detail/M02742?ima=3456"
    )
  })
})

describe("parseHinataNewsHtml()", () => {
  const html = readFixture("hinata-news.html")

  it("parses news correctly, oldest first", () => {
    expect(parseHinataNewsHtml(html)).toMatchInlineSnapshot(`
      [
        {
          "category": "その他",
          "date": 2026-06-06T15:00:00.000Z,
          "group": "hinata",
          "id": "O100281",
          "title": "「日向坂ちゃんねる」にて新着動画を公開！",
          "url": "https://www.hinatazaka46.com/s/official/news/detail/O100281?ima=0000",
        },
        {
          "category": "メディア",
          "date": 2026-06-29T15:00:00.000Z,
          "group": "hinata",
          "id": "M02742",
          "title": "「週刊SPA!」7月7日・7月14日合併号の表紙・巻頭に登場！",
          "url": "https://www.hinatazaka46.com/s/official/news/detail/M02742?ima=0000",
        },
        {
          "category": "リリース",
          "date": 2026-06-29T15:00:00.000Z,
          "group": "hinata",
          "id": "R00555",
          "title": "Blu-ray＆DVD『7周年記念MEMORIAL LIVE』の絵柄を公開！",
          "url": "https://www.hinatazaka46.com/s/official/news/detail/R00555?ima=0000",
        },
      ]
    `)
  })

  it("falls back to the category class when the visible label is empty", () => {
    expect(parseHinataNewsHtml(html)[0]?.category).toBe("その他")
  })

  it("skips news with no href", () => {
    expect(parseHinataNewsHtml(html).every(news => news.title !== "リンク切れの項目")).toBe(true)
  })

  it("returns an empty array when there is no news list", () => {
    expect(parseHinataNewsHtml("<html></html>")).toEqual([])
  })
})

describe("parseHinataNewsCategoriesHtml()", () => {
  it("parses the category nav, skipping the ALL link", () => {
    expect(parseHinataNewsCategoriesHtml(readFixture("hinata-news.html"))).toEqual({
      fanclubonly: "ファンクラブ",
      media: "メディア",
      other: "その他"
    })
  })

  it("returns an empty object when there is no category nav", () => {
    expect(parseHinataNewsCategoriesHtml("<html></html>")).toEqual({})
  })

  it("keys on the class, not the cd query value, for fan club news", () => {
    expect(
      parseHinataNewsCategoriesHtml(readFixture("hinata-news.html"))["fanclub"]
    ).toBeUndefined()
  })
})

describe("parseHinataNewsDetailHtml()", () => {
  const html = readFixture("hinata-news-detail.html")
  const url = "https://www.hinatazaka46.com/s/official/news/detail/M02742?ima=0000"

  it("throws ParseError when the id cannot be extracted from the URL", () => {
    expect(() => parseHinataNewsDetailHtml(html, "https://www.hinatazaka46.com/")).toThrow(
      ParseError
    )
  })

  it("throws ParseError when article element not found", () => {
    expect(() => parseHinataNewsDetailHtml("<html></html>", url)).toThrow(ParseError)
  })

  it("parses news detail correctly", () => {
    expect(parseHinataNewsDetailHtml(html, url)).toMatchInlineSnapshot(`
      {
        "category": "メディア",
        "date": 2026-06-29T15:00:00.000Z,
        "group": "hinata",
        "html": "<p><span>ダミー本文です。<br>ぜひチェックしてみてください。</span></p>",
        "id": "M02742",
        "members": [
          "金村美玖",
          "山下葉留花",
        ],
        "title": "「週刊SPA!」7月7日・7月14日合併号の表紙・巻頭に登場！",
        "url": "https://www.hinatazaka46.com/s/official/news/detail/M02742?ima=0000",
      }
    `)
  })
})

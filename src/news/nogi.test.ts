import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchNogiNews,
  fetchNogiNewsCategories,
  fetchNogiNewsJs,
  getNogiNewsDetailUrl,
  getNogiNewsUrl,
  parseNogiNewsCategoriesHtml,
  parseNogiNewsJs
} from "./nogi"

describe("fetchNogiNews()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("returns parsed news on 200", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((requestUrl: string) => ({
        status: 200,
        text: vi
          .fn()
          .mockResolvedValue(
            readFixture(
              requestUrl.includes("/api/list/news")
                ? "nogi-news.jsonp"
                : "nogi-news-categories.html"
            )
          ),
        body: { cancel: vi.fn() }
      }))
    )
    const { news, js, url } = await fetchNogiNews({ year: 2026, month: 6 })
    expect(news).toHaveLength(3)
    expect(js).toBe(readFixture("nogi-news.jsonp"))
    expect(url).toBe(
      "https://www.nogizaka46.com/s/n46/api/list/news?ima=3456&dy=202606&callback=res"
    )
  })
})

describe("fetchNogiNewsJs()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("sends the listing page as Referer", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      text: vi.fn().mockResolvedValue(readFixture("nogi-news.jsonp")),
      body: { cancel: vi.fn() }
    })
    vi.stubGlobal("fetch", fetchMock)
    await fetchNogiNewsJs({ year: 2026, month: 6 })
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.Referer).toBe(
      "https://www.nogizaka46.com/s/n46/news/list?ima=3456&dy=202606"
    )
  })

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiNewsJs({ year: 2026, month: 6 })).rejects.toBeInstanceOf(FetchStatusError)
  })

  it("throws RangeError when month is given without year", async () => {
    await expect(fetchNogiNewsJs({ month: 6 })).rejects.toBeInstanceOf(RangeError)
  })
})

describe("getNogiNewsUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("applies ima, dy, and callback params", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getNogiNewsUrl({ year: 2026, month: 6 })).toBe(
      "https://www.nogizaka46.com/s/n46/api/list/news?ima=3456&dy=202606&callback=res"
    )
  })

  it("omits dy when no filter is given", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getNogiNewsUrl()).toBe(
      "https://www.nogizaka46.com/s/n46/api/list/news?ima=3456&callback=res"
    )
  })
})

describe("getNogiNewsDetailUrl()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns correct URL", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getNogiNewsDetailUrl("102051")).toBe(
      "https://www.nogizaka46.com/s/n46/news/detail/102051?ima=3456"
    )
  })
})

describe("fetchNogiNewsCategories()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("returns the parsed category nav on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("nogi-news-categories.html")),
        body: { cancel: vi.fn() }
      })
    )
    await expect(fetchNogiNewsCategories()).resolves.toMatchObject({ tv: "テレビ" })
  })

  it("falls back to the known categories on non-200 instead of throwing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 503, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiNewsCategories()).resolves.toMatchObject({ tv: "テレビ" })
  })

  it("falls back to the known categories when the nav is absent", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue("<html></html>"),
        body: { cancel: vi.fn() }
      })
    )
    await expect(fetchNogiNewsCategories()).resolves.toMatchObject({ tv: "テレビ" })
  })
})

describe("parseNogiNewsCategoriesHtml()", () => {
  it("parses the category nav, skipping the ALL link", () => {
    expect(parseNogiNewsCategoriesHtml(readFixture("nogi-news-categories.html"))).toEqual({
      release: "CD/音楽配信/映像商品",
      tv: "テレビ",
      unknown_category: "新カテゴリー"
    })
  })

  it("returns an empty object when there is no category nav", () => {
    expect(parseNogiNewsCategoriesHtml("<html></html>")).toEqual({})
  })
})

describe("parseNogiNewsJs()", () => {
  const js = readFixture("nogi-news.jsonp")

  it("throws ParseError when the callback argument is missing", () => {
    expect(() => parseNogiNewsJs("not jsonp")).toThrow(ParseError)
  })

  it("parses news correctly, oldest first", () => {
    expect(parseNogiNewsJs(js)).toMatchInlineSnapshot(`
      [
        {
          "category": "テレビ",
          "date": 2026-05-31T15:00:00.000Z,
          "datetime": 2026-05-31T15:44:51.000Z,
          "group": "nogi",
          "html": "<p>Broadcast detail placeholder.</p>",
          "id": "101977",
          "title": "テレビ番組の出演情報",
          "url": "https://www.nogizaka46.com/s/n46/news/detail/101977?ima=0140",
        },
        {
          "category": "unknown_category",
          "date": 2026-06-14T15:00:00.000Z,
          "datetime": 2026-06-15T03:00:00.000Z,
          "group": "nogi",
          "html": "<p>Unmapped category placeholder.</p>",
          "id": "102040",
          "title": "未知のカテゴリーのお知らせ",
          "url": "https://www.nogizaka46.com/s/n46/news/detail/102040?ima=0140",
        },
        {
          "category": "CD/音楽配信/映像商品",
          "date": 2026-06-29T15:00:00.000Z,
          "datetime": 2026-06-30T12:00:00.000Z,
          "group": "nogi",
          "html": "<p>News detail placeholder.</p>",
          "id": "102051",
          "title": "42ndシングル「是非に及ばず」発売記念スペシャル応募抽選",
          "url": "https://www.nogizaka46.com/s/n46/news/detail/102051?ima=0140",
        },
      ]
    `)
  })

  it("passes through a category key that is in neither map verbatim", () => {
    expect(parseNogiNewsJs(js)[1]?.category).toBe("unknown_category")
  })

  it("resolves categories from a supplied map, overriding the known categories", () => {
    const categories = parseNogiNewsCategoriesHtml(readFixture("nogi-news-categories.html"))
    expect(parseNogiNewsJs(js, categories)[1]?.category).toBe("新カテゴリー")
  })
})

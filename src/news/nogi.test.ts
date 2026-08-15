import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchNogiNews,
  fetchNogiNewsCategories,
  fetchNogiNewsDetail,
  fetchNogiNewsDetailHtml,
  fetchNogiNewsJs,
  getNogiNewsDetailUrl,
  getNogiNewsUrl,
  parseNogiNewsCategoriesHtml,
  parseNogiNewsDetailHtml,
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

  it("throws RangeError when day is given without month", async () => {
    await expect(fetchNogiNewsJs({ year: 2026, day: 30 })).rejects.toBeInstanceOf(RangeError)
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

  it("narrows dy to a single day when day is given", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getNogiNewsUrl({ year: 2026, month: 6, day: 30 })).toBe(
      "https://www.nogizaka46.com/s/n46/api/list/news?ima=3456&dy=20260630&callback=res"
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

describe("fetchNogiNewsDetail()", () => {
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
        text: vi.fn().mockResolvedValue(readFixture("nogi-news-detail.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { newsDetail, url } = await fetchNogiNewsDetail("102051")
    expect(newsDetail.categoryKey).toBe("release")
    expect(newsDetail.categoryName).toBe("CD/音楽配信/映像商品")
    expect(url).toBe("https://www.nogizaka46.com/s/n46/news/detail/102051?ima=3456")
  })
})

describe("fetchNogiNewsDetailHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 500, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiNewsDetailHtml("102051")).rejects.toBeInstanceOf(FetchStatusError)
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

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 503, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiNewsCategories()).rejects.toBeInstanceOf(FetchStatusError)
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
    await expect(fetchNogiNewsCategories()).resolves.toEqual({})
  })
})

describe("fetchNogiNews() category failures", () => {
  afterEach(() => vi.restoreAllMocks())

  it("rejects when the category nav cannot be fetched", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((requestUrl: string) =>
        requestUrl.includes("/api/list/news")
          ? {
              status: 200,
              text: vi.fn().mockResolvedValue(readFixture("nogi-news.jsonp")),
              body: { cancel: vi.fn() }
            }
          : { status: 503, url: requestUrl, body: { cancel: vi.fn() } }
      )
    )
    await expect(fetchNogiNews({ year: 2026, month: 6 })).rejects.toBeInstanceOf(FetchStatusError)
  })

  it("resolves with empty names when the nav loads but carries no categories", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((requestUrl: string) => ({
        status: 200,
        text: vi
          .fn()
          .mockResolvedValue(
            requestUrl.includes("/api/list/news") ? readFixture("nogi-news.jsonp") : "<html></html>"
          ),
        body: { cancel: vi.fn() }
      }))
    )
    const { news } = await fetchNogiNews({ year: 2026, month: 6 })
    expect(news).toHaveLength(3)
    expect(news.every(item => item.categoryName === "")).toBe(true)
    expect(news.every(item => item.categoryKey !== "")).toBe(true)
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
          "categoryKey": "tv",
          "categoryName": "",
          "date": 2026-05-31T15:00:00.000Z,
          "datetime": 2026-05-31T15:44:51.000Z,
          "html": "<p>Broadcast detail placeholder.</p>",
          "id": "101977",
          "title": "テレビ番組の出演情報",
          "url": "https://www.nogizaka46.com/s/n46/news/detail/101977?ima=0140",
        },
        {
          "categoryKey": "unknown_category",
          "categoryName": "",
          "date": 2026-06-14T15:00:00.000Z,
          "datetime": 2026-06-15T03:00:00.000Z,
          "html": "<p>Unmapped category placeholder.</p>",
          "id": "102040",
          "title": "未知のカテゴリーのお知らせ",
          "url": "https://www.nogizaka46.com/s/n46/news/detail/102040?ima=0140",
        },
        {
          "categoryKey": "release",
          "categoryName": "",
          "date": 2026-06-29T15:00:00.000Z,
          "datetime": 2026-06-30T12:00:00.000Z,
          "html": "<p>News detail placeholder.</p>",
          "id": "102051",
          "title": "42ndシングル「是非に及ばず」発売記念スペシャル応募抽選",
          "url": "https://www.nogizaka46.com/s/n46/news/detail/102051?ima=0140",
        },
      ]
    `)
  })

  it("exposes keys with empty names when no category map is supplied", () => {
    expect(parseNogiNewsJs(js)[1]?.categoryKey).toBe("unknown_category")
    expect(parseNogiNewsJs(js).every(news => news.categoryName === "")).toBe(true)
  })

  it("resolves names from a supplied map", () => {
    const categories = parseNogiNewsCategoriesHtml(readFixture("nogi-news-categories.html"))
    expect(parseNogiNewsJs(js, categories)[1]?.categoryName).toBe("新カテゴリー")
  })
})

describe("parseNogiNewsDetailHtml()", () => {
  const html = readFixture("nogi-news-detail.html")
  const url = "https://www.nogizaka46.com/s/n46/news/detail/102051?ima=0000"

  it("throws ParseError when the id cannot be extracted from the URL", () => {
    expect(() => parseNogiNewsDetailHtml(html, "https://www.nogizaka46.com/")).toThrow(ParseError)
  })

  it("throws ParseError when article element not found", () => {
    expect(() => parseNogiNewsDetailHtml("<html></html>", url)).toThrow(ParseError)
  })

  it("parses news detail correctly", () => {
    expect(parseNogiNewsDetailHtml(html, url)).toMatchInlineSnapshot(`
      {
        "categoryKey": "release",
        "categoryName": "CD/音楽配信/映像商品",
        "date": 2026-06-29T15:00:00.000Z,
        "html": "ダミー本文です。<br>ぜひご確認ください。",
        "id": "102051",
        "title": "42ndシングル「是非に及ばず」発売記念スペシャル応募抽選",
        "url": "https://www.nogizaka46.com/s/n46/news/detail/102051?ima=0000",
      }
    `)
  })

  it("excludes the prev/next nav and latest-news list from the content html", () => {
    const { html: contentHtml } = parseNogiNewsDetailHtml(html, url)
    expect(contentHtml).not.toContain("関連ニュース")
    expect(contentHtml).not.toContain("次の記事")
  })

  it("returns an empty name when the label is empty", () => {
    const fallback = `
      <main>
        <header class="post_header">
          <div class="post_header_cat">
            <div class="cat_icon i--tv"></div>
            <p class="cat_name"></p>
          </div>
          <h1>タイトル</h1>
          <div class="post_header_data"><span>2026.06.30</span></div>
        </header>
      </main>`
    expect(parseNogiNewsDetailHtml(fallback, url).categoryName).toBe("")
    expect(parseNogiNewsDetailHtml(fallback, url).categoryKey).toBe("tv")
  })
})

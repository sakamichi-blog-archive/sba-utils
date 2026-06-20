import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchNogiBlogs,
  fetchNogiBlog,
  fetchNogiBlogHtml,
  fetchNogiBlogsJs,
  getNogiBlogUrl,
  parseNogiBlogHtml,
  parseNogiBlogsJs
} from "./nogi"

describe("fetchNogiBlog", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiBlog(200001)).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("fetchNogiBlogHtml", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 500, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiBlogHtml(200001)).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("fetchNogiBlogs", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("returns parsed blogs on 200", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("nogi-blogs.jsonp")),
        body: { cancel: vi.fn() }
      })
    )
    const { blogs, js, url } = await fetchNogiBlogs()
    expect(blogs).toMatchInlineSnapshot(`
      [
        {
          "datetime": 2026-06-07T08:18:49.000Z,
          "html": "<p><img src="/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto3.jpg"/></p>",
          "images": [
            {
              "anchorElementUrl": undefined,
              "src": "/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto3.jpg",
              "srcUrl": "https://www.nogizaka46.com/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto3.jpg",
            },
          ],
          "memberName": "矢田 萌華",
          "title": "吾輩は猫である。名前は",
          "uid": 104629,
          "url": "https://www.nogizaka46.com/s/n46/diary/detail/104629?ima=0123",
        },
        {
          "datetime": 2026-06-19T09:35:30.000Z,
          "html": "<p><img  src="/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto1.jpg"/><img  src="/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto2.jpg"/></p>",
          "images": [
            {
              "anchorElementUrl": undefined,
              "src": "/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto1.jpg",
              "srcUrl": "https://www.nogizaka46.com/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto1.jpg",
            },
            {
              "anchorElementUrl": undefined,
              "src": "/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto2.jpg",
              "srcUrl": "https://www.nogizaka46.com/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto2.jpg",
            },
          ],
          "memberName": "鈴木 佑捺",
          "title": "不思議な味覚",
          "uid": 104665,
          "url": "https://www.nogizaka46.com/s/n46/diary/detail/104665?ima=0123",
        },
      ]
    `)
    expect(js).toBe(readFixture("nogi-blogs.jsonp"))
    expect(url).toBe("https://www.nogizaka46.com/s/n46/api/list/blog?ima=3456&rw=32&st=0&callback=res")
  })
})

describe("fetchNogiBlogsJs", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchNogiBlogsJs()).rejects.toBeInstanceOf(FetchStatusError)
  })

  it("returns response text on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("nogi-blogs.jsonp")),
        body: { cancel: vi.fn() }
      })
    )
    await expect(fetchNogiBlogsJs()).resolves.toMatchObject({ js: readFixture("nogi-blogs.jsonp") })
  })
})

describe("getNogiBlogUrl", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns correct URL", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getNogiBlogUrl(200001)).toBe(
      "https://www.nogizaka46.com/s/n46/diary/detail/200001?ima=3456"
    )
  })
})

describe("parseNogiBlogHtml", () => {
  const html = readFixture("nogi-blog.html")

  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("throws ParseError when article element not found", () => {
    expect(() =>
      parseNogiBlogHtml("<html></html>", "https://www.nogizaka46.com/s/n46/diary/detail/104629")
    ).toThrow(ParseError)
  })

  it("parses single blog fields correctly", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(parseNogiBlogHtml(html, getNogiBlogUrl(104629))).toMatchInlineSnapshot(`
      {
        "datetime": 2026-06-07T08:18:00.000Z,
        "html": "<p><img src="/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto1.jpg"></p>",
        "images": [
          {
            "anchorElementUrl": undefined,
            "src": "/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto1.jpg",
            "srcUrl": "https://www.nogizaka46.com/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto1.jpg",
          },
        ],
        "memberName": "矢田 萌華",
        "title": "吾輩は猫である。名前は",
        "uid": 104629,
        "url": "https://www.nogizaka46.com/s/n46/diary/detail/104629?ima=3456",
      }
    `)
  })
})

describe("parseNogiBlogsJs", () => {
  const js = readFixture("nogi-blogs.jsonp")

  it("returns blogs in chronological order", () => {
    const blogs = parseNogiBlogsJs(js)
    expect(blogs).toHaveLength(2)
    expect(blogs[0]?.uid).toBe(104629)
    expect(blogs[1]?.uid).toBe(104665)
  })

  it("parses blog fields correctly", () => {
    const [first, second] = parseNogiBlogsJs(js)
    expect(first).toMatchInlineSnapshot(`
      {
        "datetime": 2026-06-07T08:18:49.000Z,
        "html": "<p><img src="/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto3.jpg"/></p>",
        "images": [
          {
            "anchorElementUrl": undefined,
            "src": "/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto3.jpg",
            "srcUrl": "https://www.nogizaka46.com/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto3.jpg",
          },
        ],
        "memberName": "矢田 萌華",
        "title": "吾輩は猫である。名前は",
        "uid": 104629,
        "url": "https://www.nogizaka46.com/s/n46/diary/detail/104629?ima=0123",
      }
    `)
    expect(second).toMatchInlineSnapshot(`
      {
        "datetime": 2026-06-19T09:35:30.000Z,
        "html": "<p><img  src="/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto1.jpg"/><img  src="/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto2.jpg"/></p>",
        "images": [
          {
            "anchorElementUrl": undefined,
            "src": "/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto1.jpg",
            "srcUrl": "https://www.nogizaka46.com/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto1.jpg",
          },
          {
            "anchorElementUrl": undefined,
            "src": "/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto2.jpg",
            "srcUrl": "https://www.nogizaka46.com/files/46/diary/n46/MEMBER/moblog/202606/mobPhoto2.jpg",
          },
        ],
        "memberName": "鈴木 佑捺",
        "title": "不思議な味覚",
        "uid": 104665,
        "url": "https://www.nogizaka46.com/s/n46/diary/detail/104665?ima=0123",
      }
    `)
  })

  it("throws ParseError when JS has no matching call", () => {
    expect(() => parseNogiBlogsJs("other({})")).toThrow(ParseError)
  })

  it("normalizes full-width numbers in member name", () => {
    const fullWidthJs = `res({"data":[{"code":"104999","date":"2026/06/07 17:18:49","link":"https://www.nogizaka46.com/s/n46/diary/detail/104999","name":"５期生","text":"","title":"Test"}]})`
    const [blog] = parseNogiBlogsJs(fullWidthJs)
    expect(blog?.memberName).toBe("5期生")
  })
})

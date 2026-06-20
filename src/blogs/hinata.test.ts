import { afterEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchHinataBlogs,
  fetchHinataBlog,
  fetchHinataBlogHtml,
  fetchHinataBlogsHtml,
  getHinataBlogUrl,
  parseHinataBlogHtml,
  parseHinataBlogsHtml
} from "./hinata"

describe("fetchHinataBlog", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchHinataBlog(100001)).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("fetchHinataBlogHtml", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 500, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchHinataBlogHtml(100001)).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("fetchHinataBlogs", () => {
  afterEach(() => vi.restoreAllMocks())

  it("returns parsed blogs on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("hinata-blogs.html")),
        body: { cancel: vi.fn() }
      })
    )
    await expect(fetchHinataBlogs()).resolves.toMatchInlineSnapshot(`
      [
        {
          "datetime": 2026-06-14T02:41:00.000Z,
          "html": "<p>
                      <img src="https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto3.jpg">
                    </p>",
          "images": [
            {
              "anchorElementUrl": undefined,
              "src": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto3.jpg",
              "srcUrl": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto3.jpg",
            },
          ],
          "memberName": "佐藤 優羽",
          "title": "何色の花火を待っているのか。",
          "uid": 69781,
          "url": "https://www.hinatazaka46.com/s/official/diary/detail/69781?ima=0000&cd=member",
        },
        {
          "datetime": 2026-06-19T13:19:00.000Z,
          "html": "<p>
                      <img src="https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto1.jpg">
                      <img src="https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto2.jpg">
                    </p>",
          "images": [
            {
              "anchorElementUrl": undefined,
              "src": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto1.jpg",
              "srcUrl": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto1.jpg",
            },
            {
              "anchorElementUrl": undefined,
              "src": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto2.jpg",
              "srcUrl": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto2.jpg",
            },
          ],
          "memberName": "鶴崎 仁香",
          "title": "夢の未来。",
          "uid": 69855,
          "url": "https://www.hinatazaka46.com/s/official/diary/detail/69855?ima=0000&cd=member",
        },
      ]
    `)
  })
})

describe("fetchHinataBlogsHtml", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchHinataBlogsHtml()).rejects.toBeInstanceOf(FetchStatusError)
  })

  it("returns response text on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("hinata-blogs.html")),
        body: { cancel: vi.fn() }
      })
    )
    await expect(fetchHinataBlogsHtml()).resolves.toBe(readFixture("hinata-blogs.html"))
  })
})

describe("getHinataBlogUrl", () => {
  it("returns correct URL", () => {
    expect(getHinataBlogUrl(100001)).toBe(
      "https://www.hinatazaka46.com/s/official/diary/detail/100001?ima=0000&cd=member"
    )
  })
})

describe("parseHinataBlogHtml", () => {
  const html = readFixture("hinata-blog.html")

  it("throws ParseError when article element not found", () => {
    expect(() =>
      parseHinataBlogHtml("<html></html>", "https://www.hinatazaka46.com/s/official/diary/detail/69781")
    ).toThrow(ParseError)
  })

  it("parses single blog fields correctly", () => {
    expect(
      parseHinataBlogHtml(html, "https://www.hinatazaka46.com/s/official/diary/detail/69781?ima=0000&cd=member")
    ).toMatchInlineSnapshot(`
      {
        "datetime": 2026-06-14T02:41:00.000Z,
        "html": "<p>
                    <img src="https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto1.jpg">
                    <img src="https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto2.jpg">
                  </p>",
        "images": [
          {
            "anchorElementUrl": undefined,
            "src": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto1.jpg",
            "srcUrl": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto1.jpg",
          },
          {
            "anchorElementUrl": undefined,
            "src": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto2.jpg",
            "srcUrl": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto2.jpg",
          },
        ],
        "memberName": "佐藤 優羽",
        "title": "何色の花火を待っているのか。",
        "uid": 69781,
        "url": "https://www.hinatazaka46.com/s/official/diary/detail/69781?ima=0000&cd=member",
      }
    `)
  })
})

describe("parseHinataBlogsHtml", () => {
  const html = readFixture("hinata-blogs.html")

  it("returns blogs in chronological order", () => {
    const blogs = parseHinataBlogsHtml(html)
    expect(blogs).toHaveLength(2)
    expect(blogs[0]?.uid).toBe(69781)
    expect(blogs[1]?.uid).toBe(69855)
  })

  it("parses blog fields correctly", () => {
    const [first, second] = parseHinataBlogsHtml(html)
    expect(first).toMatchInlineSnapshot(`
      {
        "datetime": 2026-06-14T02:41:00.000Z,
        "html": "<p>
                      <img src="https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto3.jpg">
                    </p>",
        "images": [
          {
            "anchorElementUrl": undefined,
            "src": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto3.jpg",
            "srcUrl": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto3.jpg",
          },
        ],
        "memberName": "佐藤 優羽",
        "title": "何色の花火を待っているのか。",
        "uid": 69781,
        "url": "https://www.hinatazaka46.com/s/official/diary/detail/69781?ima=0000&cd=member",
      }
    `)
    expect(second).toMatchInlineSnapshot(`
      {
        "datetime": 2026-06-19T13:19:00.000Z,
        "html": "<p>
                      <img src="https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto1.jpg">
                      <img src="https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto2.jpg">
                    </p>",
        "images": [
          {
            "anchorElementUrl": undefined,
            "src": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto1.jpg",
            "srcUrl": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto1.jpg",
          },
          {
            "anchorElementUrl": undefined,
            "src": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto2.jpg",
            "srcUrl": "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202606/mobPhoto2.jpg",
          },
        ],
        "memberName": "鶴崎 仁香",
        "title": "夢の未来。",
        "uid": 69855,
        "url": "https://www.hinatazaka46.com/s/official/diary/detail/69855?ima=0000&cd=member",
      }
    `)
  })
})

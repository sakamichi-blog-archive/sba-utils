import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchSakuraBlogs,
  fetchSakuraBlog,
  fetchSakuraBlogHtml,
  fetchSakuraBlogsHtml,
  getSakuraBlogUrl,
  parseSakuraBlogHtml,
  parseSakuraBlogsHtml
} from "./sakura"

describe("fetchSakuraBlog", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchSakuraBlog(300001)).rejects.toBeInstanceOf(FetchStatusError)
  })
})

describe("fetchSakuraBlogHtml", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 500, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchSakuraBlogHtml(300001)).rejects.toBeInstanceOf(FetchStatusError)
  })

  it("returns html and url on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue("<html></html>"),
        url: "https://sakurazaka46.com/s/s46/diary/detail/300001?ima=0000&cd=blog"
      })
    )
    await expect(fetchSakuraBlogHtml(300001)).resolves.toMatchObject({ html: "<html></html>" })
  })
})

describe("fetchSakuraBlogsHtml", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 403, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchSakuraBlogsHtml()).rejects.toBeInstanceOf(FetchStatusError)
  })

  it("returns response text on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("sakura-blogs.html")),
        body: { cancel: vi.fn() }
      })
    )
    await expect(fetchSakuraBlogsHtml()).resolves.toBe(readFixture("sakura-blogs.html"))
  })
})

describe("fetchSakuraBlogs", () => {
  afterEach(() => vi.restoreAllMocks())

  it("returns parsed blogs on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("sakura-blogs.html")),
        body: { cancel: vi.fn() }
      })
    )
    await expect(fetchSakuraBlogs()).resolves.toMatchInlineSnapshot(`
      [
        {
          "date": 2026-06-17T15:00:00.000Z,
          "memberName": "遠藤 理子",
          "title": "",
          "uid": 69842,
          "url": "https://sakurazaka46.com/s/s46/diary/detail/69842?ima=0000&cd=blog",
        },
        {
          "date": 2026-06-18T15:00:00.000Z,
          "memberName": "小田倉 麗奈",
          "title": "(ㅍ‐ㅍ  )",
          "uid": 69854,
          "url": "https://sakurazaka46.com/s/s46/diary/detail/69854?ima=0000&cd=blog",
        },
      ]
    `)
  })
})

describe("getSakuraBlogUrl", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns correct URL", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(getSakuraBlogUrl(300001)).toBe(
      "https://sakurazaka46.com/s/s46/diary/detail/300001?ima=3456&cd=blog"
    )
  })
})

describe("parseSakuraBlogHtml", () => {
  const html = readFixture("sakura-blog.html")

  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("throws ParseError when article element not found", () => {
    expect(() =>
      parseSakuraBlogHtml("<html></html>", "https://sakurazaka46.com/s/s46/diary/detail/69791")
    ).toThrow(ParseError)
  })

  it("parses single blog fields correctly", () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    expect(parseSakuraBlogHtml(html, getSakuraBlogUrl(69791))).toMatchInlineSnapshot(`
      {
        "datetime": 2026-06-15T10:20:00.000Z,
        "html": "<p>
                        <img src="/files/14/diary/s46/blog/moblog/202606/mobPhoto1.jpg">
                        <img src="/files/14/diary/s46/blog/moblog/202606/mobPhoto2.jpg">
                        <img src="/files/14/diary/s46/blog/moblog/202606/mobPhoto3.jpg">
                      </p>",
        "images": [
          {
            "anchorElementUrl": undefined,
            "src": "/files/14/diary/s46/blog/moblog/202606/mobPhoto1.jpg",
            "srcUrl": "https://sakurazaka46.com/files/14/diary/s46/blog/moblog/202606/mobPhoto1.jpg",
          },
          {
            "anchorElementUrl": undefined,
            "src": "/files/14/diary/s46/blog/moblog/202606/mobPhoto2.jpg",
            "srcUrl": "https://sakurazaka46.com/files/14/diary/s46/blog/moblog/202606/mobPhoto2.jpg",
          },
          {
            "anchorElementUrl": undefined,
            "src": "/files/14/diary/s46/blog/moblog/202606/mobPhoto3.jpg",
            "srcUrl": "https://sakurazaka46.com/files/14/diary/s46/blog/moblog/202606/mobPhoto3.jpg",
          },
        ],
        "memberName": "勝又 春",
        "title": "カメラ始めました＿",
        "uid": 69791,
        "url": "https://sakurazaka46.com/s/s46/diary/detail/69791?ima=3456&cd=blog",
      }
    `)
  })
})

describe("parseSakuraBlogsHtml", () => {
  const html = readFixture("sakura-blogs.html")

  it("returns blogs in chronological order", () => {
    const blogs = parseSakuraBlogsHtml(html)
    expect(blogs).toHaveLength(2)
    expect(blogs[0]?.uid).toBe(69842)
    expect(blogs[1]?.uid).toBe(69854)
  })

  it("parses blog fields correctly", () => {
    const [first, second] = parseSakuraBlogsHtml(html)
    expect(first).toMatchInlineSnapshot(`
      {
        "date": 2026-06-17T15:00:00.000Z,
        "memberName": "遠藤 理子",
        "title": "",
        "uid": 69842,
        "url": "https://sakurazaka46.com/s/s46/diary/detail/69842?ima=0000&cd=blog",
      }
    `)
    expect(second).toMatchInlineSnapshot(`
      {
        "date": 2026-06-18T15:00:00.000Z,
        "memberName": "小田倉 麗奈",
        "title": "(ㅍ‐ㅍ  )",
        "uid": 69854,
        "url": "https://sakurazaka46.com/s/s46/diary/detail/69854?ima=0000&cd=blog",
      }
    `)
  })
})

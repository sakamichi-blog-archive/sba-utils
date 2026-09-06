import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchKeyakiBlog,
  fetchKeyakiBlogHtml,
  fetchKeyakiBlogs,
  fetchKeyakiBlogsHtml,
  getKeyakiBlogUrl,
  parseKeyakiBlogHtml,
  parseKeyakiBlogsHtml
} from "./keyaki"

describe("fetchKeyakiBlog()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 404, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchKeyakiBlog("36075")).rejects.toBeInstanceOf(FetchStatusError)
  })

  it("returns the parsed blog on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(readFixture("keyaki-blog.html")),
        url: "https://www.keyakizaka46.com/s/k46o/diary/detail/36075?ima=0000&cd=member"
      })
    )
    const { blog } = await fetchKeyakiBlog("36075")
    expect(blog.uid).toBe("36075")
    expect(blog.memberName).toBe("欅坂 太郎")
  })
})

describe("fetchKeyakiBlogHtml()", () => {
  afterEach(() => vi.restoreAllMocks())

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 500, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchKeyakiBlogHtml("36075")).rejects.toBeInstanceOf(FetchStatusError)
  })

  it("returns html and url on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue("<html></html>"),
        url: "https://www.keyakizaka46.com/s/k46o/diary/detail/36075?ima=0000&cd=member"
      })
    )
    await expect(fetchKeyakiBlogHtml("36075")).resolves.toMatchObject({ html: "<html></html>" })
  })
})

describe("fetchKeyakiBlogs()", () => {
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
        text: vi.fn().mockResolvedValue(readFixture("keyaki-blogs.html")),
        body: { cancel: vi.fn() }
      })
    )
    const { blogs, url } = await fetchKeyakiBlogs({ year: 2020, month: 10 })
    expect(blogs).toHaveLength(2)
    expect(url).toBe(
      "https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=3456&cd=member&dy=202010"
    )
  })
})

describe("fetchKeyakiBlogsHtml()", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("throws FetchStatusError on non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ status: 403, url: "https://example.com", body: { cancel: vi.fn() } })
    )
    await expect(fetchKeyakiBlogsHtml()).rejects.toBeInstanceOf(FetchStatusError)
  })

  it("applies the member and page params", async () => {
    vi.setSystemTime(new Date("2026-06-20T12:34:56+09:00"))
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue("<html></html>"),
        body: { cancel: vi.fn() }
      })
    )
    const { url } = await fetchKeyakiBlogsHtml({ memberUid: "14", page: 1 })
    expect(url).toBe(
      "https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=3456&cd=member&page=1&ct=14"
    )
  })
})

describe("getKeyakiBlogUrl()", () => {
  it("builds the blog URL from a uid", () => {
    expect(getKeyakiBlogUrl("36075")).toBe(
      "https://www.keyakizaka46.com/s/k46o/diary/detail/36075?ima=0000&cd=member"
    )
  })
})

describe("parseKeyakiBlogHtml()", () => {
  const html = readFixture("keyaki-blog.html")
  const url = "https://www.keyakizaka46.com/s/k46o/diary/detail/36075?ima=0000&cd=member"

  it("throws ParseError when the uid cannot be extracted from the URL", () => {
    expect(() => parseKeyakiBlogHtml(html, "https://www.keyakizaka46.com/")).toThrow(ParseError)
  })

  it("throws ParseError when article element not found", () => {
    expect(() => parseKeyakiBlogHtml("<html></html>", url)).toThrow(ParseError)
  })

  it("parses single blog fields correctly", () => {
    expect(parseKeyakiBlogHtml(html, url)).toMatchInlineSnapshot(`
      {
        "datetime": 2020-10-13T14:57:00.000Z,
        "html": "<div dir="ltr">
                        <span>ダミー本文です。</span><br><span>ぜひご確認ください。</span>
                      </div>
                      <div dir="ltr">
                        <img src="https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/202010/mobPhoto1.jpg">
                      </div>",
        "images": [
          {
            "anchorElementUrl": undefined,
            "src": "https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/202010/mobPhoto1.jpg",
            "srcUrl": "https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/202010/mobPhoto1.jpg",
          },
        ],
        "memberName": "欅坂 太郎",
        "title": "ダミータイトル",
        "uid": "36075",
        "url": "https://www.keyakizaka46.com/s/k46o/diary/detail/36075?ima=0000&cd=member",
      }
    `)
  })
})

describe("parseKeyakiBlogsHtml()", () => {
  const html = readFixture("keyaki-blogs.html")

  it("returns blogs in chronological order", () => {
    const blogs = parseKeyakiBlogsHtml(html)
    expect(blogs).toHaveLength(2)
    expect(blogs[0]?.uid).toBe("36070")
    expect(blogs[1]?.uid).toBe("36075")
  })

  it("parses blog fields correctly", () => {
    expect(parseKeyakiBlogsHtml(html)[1]).toMatchInlineSnapshot(`
      {
        "datetime": 2020-10-13T14:57:00.000Z,
        "html": "<div dir="ltr"><span>ダミー本文です。</span></div>
                      <div dir="ltr">
                        <img src="https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/202010/mobPhoto1.jpg">
                      </div>",
        "images": [
          {
            "anchorElementUrl": undefined,
            "src": "https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/202010/mobPhoto1.jpg",
            "srcUrl": "https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/202010/mobPhoto1.jpg",
          },
        ],
        "memberName": "欅坂 太郎",
        "title": "ダミータイトル",
        "uid": "36075",
        "url": "https://www.keyakizaka46.com/s/k46o/diary/detail/36075?ima=0000&cd=member",
      }
    `)
  })

  it("skips a blog with no href", () => {
    expect(parseKeyakiBlogsHtml(html).every(blog => blog.title !== "リンク切れの項目")).toBe(true)
  })

  it("drops a blog whose datetime cannot be read, keeping the rest of the page", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const blogs = parseKeyakiBlogsHtml(html.replace("2020/10/13 23:57", "　"))
    expect(blogs).toHaveLength(1)
    expect(blogs[0]?.uid).toBe("36070")
  })

  it("returns an empty array when there is no blog list", () => {
    expect(parseKeyakiBlogsHtml("<html></html>")).toEqual([])
  })
})

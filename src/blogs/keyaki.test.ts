import { afterEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchKeyakiBlog,
  fetchKeyakiBlogHtml,
  getKeyakiBlogUrl,
  parseKeyakiBlogHtml
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

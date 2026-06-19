import { afterEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchSakuraBlog,
  fetchSakuraBlogsHtml,
  getSakuraBlogUrl,
  parseSakuraBlogHtml,
  parseSakuraBlogsHtml
} from "./sakura"

describe("getSakuraBlogUrl", () => {
  it("includes uid in URL", () => {
    expect(getSakuraBlogUrl(300001)).toContain("/diary/detail/300001")
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
    expect(first?.uid).toBe(69842)
    expect(first?.memberName).toBe("遠藤 理子")
    expect(first?.title).toBe("")
    expect(first?.date).toEqual(new Date("2026-06-18T00:00:00+09:00"))
    expect(first?.url).toContain("/diary/detail/69842")
    expect(second?.title).toBe("(ㅍ‐ㅍ  )")
  })
})

describe("parseSakuraBlogHtml", () => {
  const html = readFixture("sakura-blog.html")

  it("parses single blog fields correctly", () => {
    const blog = parseSakuraBlogHtml(html, 69791)
    expect(blog.uid).toBe(69791)
    expect(blog.memberName).toBe("勝又 春")
    expect(blog.title).toBe("カメラ始めました＿")
    expect(blog.datetime).toEqual(new Date("2026-06-15T19:20:00+09:00"))
    expect(blog.images).toHaveLength(3)
  })
})

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
})

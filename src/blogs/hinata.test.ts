import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchHinataBlog,
  fetchHinataBlogHtml,
  fetchHinataBlogsHtml,
  getHinataBlogUrl,
  parseHinataBlogHtml,
  parseHinataBlogsHtml
} from "./hinata"

describe("getHinataBlogUrl", () => {
  it("returns correct URL", () => {
    expect(getHinataBlogUrl(100001)).toBe(
      "https://www.hinatazaka46.com/s/official/diary/detail/100001?ima=0000&cd=member"
    )
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
    expect(first?.uid).toBe(69781)
    expect(first?.memberName).toBe("佐藤 優羽")
    expect(first?.title).toBe("何色の花火を待っているのか。")
    expect(first?.datetime).toEqual(new Date("2026-06-14T11:41:00+09:00"))
    expect(first?.url).toContain("/diary/detail/69781")
    expect(first?.images).toHaveLength(1)
    expect(second?.images).toHaveLength(2)
  })
})

describe("parseHinataBlogHtml", () => {
  const html = readFixture("hinata-blog.html")

  it("parses single blog fields correctly", () => {
    const blog = parseHinataBlogHtml(html, 69781)
    expect(blog.uid).toBe(69781)
    expect(blog.memberName).toBe("佐藤 優羽")
    expect(blog.title).toBe("何色の花火を待っているのか。")
    expect(blog.datetime).toEqual(new Date("2026-06-14T11:41:00+09:00"))
    expect(blog.images).toHaveLength(2)
  })
})

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

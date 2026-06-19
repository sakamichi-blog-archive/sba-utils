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
    expect(blogs[0]?.uid).toBe(300001)
    expect(blogs[1]?.uid).toBe(300002)
  })

  it("parses blog fields correctly", () => {
    const [blog] = parseSakuraBlogsHtml(html)
    expect(blog?.uid).toBe(300001)
    expect(blog?.memberName).toBe("Moriya Rena")
    expect(blog?.title).toBe("Title One")
    expect(blog?.date).toEqual(new Date("2024-05-03T00:00:00+09:00"))
    expect(blog?.url).toContain("/diary/detail/300001")
  })
})

describe("parseSakuraBlogHtml", () => {
  const html = readFixture("sakura-blog.html")

  it("parses single blog fields correctly", () => {
    const blog = parseSakuraBlogHtml(html, 300001)
    expect(blog.uid).toBe(300001)
    expect(blog.memberName).toBe("Moriya Rena")
    expect(blog.title).toBe("Title One")
    expect(blog.datetime).toEqual(new Date("2024-05-03T09:05:00+09:00"))
    expect(blog.images).toHaveLength(1)
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

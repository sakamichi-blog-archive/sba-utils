import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { afterEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError } from "../shared/errors"
import {
  fetchHinataBlogHtml,
  fetchHinataBlogsHtml,
  getHinataBlogUrl,
  parseHinataBlogHtml,
  parseHinataBlogsHtml
} from "./hinata"

const fixturesDir = resolve(import.meta.dirname, "__fixtures__")

describe("getHinataBlogUrl", () => {
  it("includes uid in URL", () => {
    expect(getHinataBlogUrl(100001)).toContain("/diary/detail/100001")
  })
})

describe("parseHinataBlogsHtml", () => {
  const html = readFileSync(resolve(fixturesDir, "hinata-blogs.html"), "utf-8")

  it("returns blogs in chronological order", () => {
    const blogs = parseHinataBlogsHtml(html)
    expect(blogs).toHaveLength(2)
    expect(blogs[0]?.uid).toBe(100001)
    expect(blogs[1]?.uid).toBe(100002)
  })

  it("parses blog fields correctly", () => {
    const [blog] = parseHinataBlogsHtml(html)
    expect(blog?.uid).toBe(100001)
    expect(blog?.memberName).toBe("Kanemura Miku")
    expect(blog?.title).toBe("Title One")
    expect(blog?.datetime).toEqual(new Date("2024-05-03T09:05:00+09:00"))
    expect(blog?.url).toContain("/diary/detail/100001")
    expect(blog?.images).toHaveLength(1)
  })
})

describe("parseHinataBlogHtml", () => {
  const html = readFileSync(resolve(fixturesDir, "hinata-blog.html"), "utf-8")

  it("parses single blog fields correctly", () => {
    const blog = parseHinataBlogHtml(html, 100001)
    expect(blog.uid).toBe(100001)
    expect(blog.memberName).toBe("Kanemura Miku")
    expect(blog.title).toBe("Title One")
    expect(blog.datetime).toEqual(new Date("2024-05-03T09:05:00+09:00"))
    expect(blog.images).toHaveLength(1)
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

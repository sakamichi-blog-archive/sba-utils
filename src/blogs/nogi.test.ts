import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { afterEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import {
  fetchNogiBlogHtml,
  fetchNogiBlogsJs,
  getNogiBlogUrl,
  parseNogiBlogHtml,
  parseNogiBlogsJs
} from "./nogi"

const fixturesDir = resolve(import.meta.dirname, "__fixtures__")

describe("getNogiBlogUrl", () => {
  it("includes uid in URL", () => {
    expect(getNogiBlogUrl(200001)).toContain("/diary/detail/200001")
  })
})

describe("parseNogiBlogsJs", () => {
  const js = readFileSync(resolve(fixturesDir, "nogi-blogs.js"), "utf-8")

  it("returns blogs in chronological order", () => {
    const blogs = parseNogiBlogsJs(js)
    expect(blogs).toHaveLength(2)
    expect(blogs[0]?.uid).toBe(200001)
    expect(blogs[1]?.uid).toBe(200002)
  })

  it("parses blog fields correctly", () => {
    const [blog] = parseNogiBlogsJs(js)
    expect(blog?.uid).toBe(200001)
    expect(blog?.memberName).toBe("Yamashita Mana")
    expect(blog?.title).toBe("Title One")
    expect(blog?.datetime).toEqual(new Date("2024-05-03T09:05:00+09:00"))
    expect(blog?.url).toContain("/diary/detail/200001")
    expect(blog?.images).toHaveLength(1)
  })

  it("throws ParseError when JS has no matching call", () => {
    expect(() => parseNogiBlogsJs("other({})")).toThrow(ParseError)
  })
})

describe("parseNogiBlogHtml", () => {
  const html = readFileSync(resolve(fixturesDir, "nogi-blog.html"), "utf-8")

  it("parses single blog fields correctly", () => {
    const blog = parseNogiBlogHtml(html, 200001)
    expect(blog.uid).toBe(200001)
    expect(blog.memberName).toBe("Yamashita Mana")
    expect(blog.title).toBe("Title One")
    expect(blog.datetime).toEqual(new Date("2024-05-03T09:05:00+09:00"))
    expect(blog.images).toHaveLength(1)
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

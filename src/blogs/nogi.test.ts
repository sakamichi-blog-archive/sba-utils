import { afterEach, describe, expect, it, vi } from "vitest"

import { FetchStatusError, ParseError } from "../shared/errors"
import { readFixture } from "../test/utils"
import {
  fetchNogiBlog,
  fetchNogiBlogHtml,
  fetchNogiBlogsJs,
  getNogiBlogUrl,
  parseNogiBlogHtml,
  parseNogiBlogsJs
} from "./nogi"

describe("getNogiBlogUrl", () => {
  it("includes uid in URL", () => {
    expect(getNogiBlogUrl(200001)).toContain("/diary/detail/200001")
  })
})

describe("parseNogiBlogsJs", () => {
  const js = readFixture("nogi-blogs.js")

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

  it("normalizes full-width numbers in member name", () => {
    const js = `res({"data":[{"code":"200003","date":"2024/05/05 10:00:00","link":"https://www.nogizaka46.com/s/n46/diary/detail/200003","name":"田中　２号","text":"","title":"Test"}]})`
    const [blog] = parseNogiBlogsJs(js)
    expect(blog?.memberName).toBe("田中　2号")
  })
})

describe("parseNogiBlogHtml", () => {
  const html = readFixture("nogi-blog.html")

  it("parses single blog fields correctly", () => {
    const blog = parseNogiBlogHtml(html, 200001)
    expect(blog.uid).toBe(200001)
    expect(blog.memberName).toBe("Yamashita Mana")
    expect(blog.title).toBe("Title One")
    expect(blog.datetime).toEqual(new Date("2024-05-03T09:05:00+09:00"))
    expect(blog.images).toHaveLength(1)
  })
})

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

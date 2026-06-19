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
    expect(blogs[0]?.uid).toBe(104629)
    expect(blogs[1]?.uid).toBe(104665)
  })

  it("parses blog fields correctly", () => {
    const [first, second] = parseNogiBlogsJs(js)
    expect(first?.uid).toBe(104629)
    expect(first?.memberName).toBe("矢田 萌華")
    expect(first?.title).toBe("吾輩は猫である。名前は")
    expect(first?.datetime).toEqual(new Date("2026-06-07T17:18:49+09:00"))
    expect(first?.url).toContain("/diary/detail/104629")
    expect(first?.images).toHaveLength(1)
    expect(second?.images).toHaveLength(2)
  })

  it("throws ParseError when JS has no matching call", () => {
    expect(() => parseNogiBlogsJs("other({})")).toThrow(ParseError)
  })

  it("normalizes full-width numbers in member name", () => {
    const js = `res({"data":[{"code":"104999","date":"2026/06/07 17:18:49","link":"https://www.nogizaka46.com/s/n46/diary/detail/104999","name":"５期生","text":"","title":"Test"}]})`
    const [blog] = parseNogiBlogsJs(js)
    expect(blog?.memberName).toBe("5期生")
  })
})

describe("parseNogiBlogHtml", () => {
  const html = readFixture("nogi-blog.html")

  it("parses single blog fields correctly", () => {
    const blog = parseNogiBlogHtml(html, 104629)
    expect(blog.uid).toBe(104629)
    expect(blog.memberName).toBe("矢田 萌華")
    expect(blog.title).toBe("吾輩は猫である。名前は")
    expect(blog.datetime).toEqual(new Date("2026-06-07T17:18:00+09:00"))
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

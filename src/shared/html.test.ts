import { describe, expect, it } from "vitest"

import { getCategoryKeyFromClass, resolveCategoryFromClass } from "./html"

const CATEGORIES: Record<string, string> = {
  event: "イベント",
  media: "メディア",
  other: "その他"
}

describe("resolveCategoryFromClass()", () => {
  it("resolves an underscore-prefixed token", () => {
    expect(
      resolveCategoryFromClass("c-news__category category_media", "category_", CATEGORIES)
    ).toBe("メディア")
  })

  it("resolves a hyphen-prefixed token", () => {
    expect(resolveCategoryFromClass("cate-event box", "cate-", CATEGORIES)).toBe("イベント")
  })

  it("returns undefined when no token matches", () => {
    expect(resolveCategoryFromClass("box", "cate-", CATEGORIES)).toBeUndefined()
  })

  it("does not match a partial token", () => {
    expect(resolveCategoryFromClass("cate-media_extra", "cate-", CATEGORIES)).toBeUndefined()
  })

  it("returns undefined for a blank class attribute", () => {
    expect(resolveCategoryFromClass("", "cate-", CATEGORIES)).toBeUndefined()
  })
})

describe("getCategoryKeyFromClass()", () => {
  it("extracts an underscore-prefixed key", () => {
    expect(getCategoryKeyFromClass("c-news__category category_media", "category_")).toBe("media")
  })

  it("extracts a hyphen-prefixed key", () => {
    expect(getCategoryKeyFromClass("cate-event box", "cate-")).toBe("event")
  })

  it("extracts a key that is not in any known list", () => {
    expect(getCategoryKeyFromClass("cate-brandnew box", "cate-")).toBe("brandnew")
  })

  it("returns undefined when no token carries the prefix", () => {
    expect(getCategoryKeyFromClass("box", "cate-")).toBeUndefined()
  })

  it("returns undefined for a bare prefix with no key after it", () => {
    expect(getCategoryKeyFromClass("cate- box", "cate-")).toBeUndefined()
  })

  it("returns undefined for a blank class attribute", () => {
    expect(getCategoryKeyFromClass("", "cate-")).toBeUndefined()
  })
})

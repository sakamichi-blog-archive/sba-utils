import { describe, expect, it } from "vitest"

import { resolveCategoryFromClass } from "./html"

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

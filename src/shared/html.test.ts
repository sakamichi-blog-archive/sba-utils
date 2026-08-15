import { describe, expect, it } from "vitest"

import { getCategoryKeyFromClass } from "./html"

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

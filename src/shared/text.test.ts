import { describe, expect, it } from "vitest"

import { normalizeFullWidthNumbers } from "./text"

describe("normalizeFullWidthNumbers()", () => {
  it("converts full-width digits to half-width", () => {
    expect(normalizeFullWidthNumbers("２０２４年")).toBe("2024年")
  })

  it("leaves half-width digits unchanged", () => {
    expect(normalizeFullWidthNumbers("2024")).toBe("2024")
  })

  it("handles mixed string", () => {
    expect(normalizeFullWidthNumbers("第１回")).toBe("第1回")
  })
})

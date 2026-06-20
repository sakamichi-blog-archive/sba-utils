import { describe, expect, it } from "vitest"

import {
  findImagesInHtml,
  parseJsonpArgument,
  getUidFromUrl,
  normalizeFullWidthNumbers
} from "./_utils"

describe("getUidFromUrl", () => {
  it("extracts uid from full URL", () => {
    expect(getUidFromUrl("https://www.nogizaka46.com/s/n46/diary/detail/104660?ima=2926")).toBe(
      104660
    )
  })

  it("extracts uid from URL object", () => {
    expect(getUidFromUrl(new URL("https://www.nogizaka46.com/s/n46/diary/detail/104660"))).toBe(
      104660
    )
  })

  it("returns undefined when path has no diary/detail segment", () => {
    expect(getUidFromUrl("https://www.nogizaka46.com/s/n46/diary/list")).toBeUndefined()
  })
})

describe("findImagesInHtml", () => {
  const BASE = "https://example.com/blog/1"

  it("resolves relative src to absolute URL", () => {
    const [img] = findImagesInHtml('<img src="/img/photo.jpg">', BASE)
    expect(img?.src).toBe("/img/photo.jpg")
    expect(img?.srcUrl).toBe("https://example.com/img/photo.jpg")
  })

  it("passes through absolute src unchanged", () => {
    const [img] = findImagesInHtml('<img src="https://cdn.example.com/photo.jpg">', BASE)
    expect(img?.srcUrl).toBe("https://cdn.example.com/photo.jpg")
  })

  it("resolves anchor href when img is wrapped in <a>", () => {
    const [img] = findImagesInHtml('<a href="/full/photo.jpg"><img src="/thumb.jpg"></a>', BASE)
    expect(img?.anchorElementUrl).toBe("https://example.com/full/photo.jpg")
  })

  it("omits anchorElementUrl when img has no anchor parent", () => {
    const [img] = findImagesInHtml('<img src="/thumb.jpg">', BASE)
    expect(img?.anchorElementUrl).toBeUndefined()
  })

  it("omits anchorElementUrl when anchor parent has no href", () => {
    const [img] = findImagesInHtml('<a><img src="/thumb.jpg"></a>', BASE)
    expect(img?.anchorElementUrl).toBeUndefined()
  })

  it("omits anchorElementUrl when anchor parent has blank href", () => {
    const [img] = findImagesInHtml('<a href="  "><img src="/thumb.jpg"></a>', BASE)
    expect(img?.anchorElementUrl).toBeUndefined()
  })

  it("skips img with blank src", () => {
    const images = findImagesInHtml('<img src="   ">', BASE)
    expect(images).toHaveLength(0)
  })

  it("skips img with no src attribute", () => {
    const images = findImagesInHtml("<img>", BASE)
    expect(images).toHaveLength(0)
  })

  it("skips img with non-http src", () => {
    const images = findImagesInHtml('<img src="data:image/png;base64,abc">', BASE)
    expect(images).toHaveLength(0)
  })

  it("returns all imgs in order", () => {
    const html = '<img src="/img/a.jpg"><img src="/img/b.jpg"><img src="/img/c.jpg">'
    const images = findImagesInHtml(html, BASE)
    expect(images).toHaveLength(3)
    expect(images[0]?.src).toBe("/img/a.jpg")
    expect(images[1]?.src).toBe("/img/b.jpg")
    expect(images[2]?.src).toBe("/img/c.jpg")
  })
})

describe("normalizeFullWidthNumbers", () => {
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

describe("parseJsonpArgument", () => {
  it("extracts single argument from function call", () => {
    expect(parseJsonpArgument('res({"key":"value"})', "res")).toEqual({ key: "value" })
  })

  it("returns undefined when function name does not match", () => {
    expect(parseJsonpArgument('res({"key":"value"})', "other")).toBeUndefined()
  })
})

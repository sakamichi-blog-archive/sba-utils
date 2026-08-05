import * as cheerio from "cheerio"

import type { BlogListFilter } from "./_types"

/** Format a year/month/day into a site `dy=` query value (`YYYY`, `YYYYMM`, or `YYYYMMDD`) */
export function formatBlogDateFilter(filter: {
  year: number
  month?: number
  day?: number
}): string {
  const { year, month, day } = filter
  if (day !== undefined && month === undefined) {
    throw new RangeError("`month` is required when `day` is specified")
  }

  let value = String(year)
  if (month !== undefined) value += String(month).padStart(2, "0")
  if (day !== undefined) value += String(day).padStart(2, "0")

  return value
}

/** Like {@link formatBlogDateFilter}, but `year` may be omitted entirely (returns `undefined`); throws if `month`/`day` is given without it */
export function formatOptionalBlogDateFilter(filter?: BlogListFilter): string | undefined {
  if (filter?.year === undefined) {
    if (filter?.month !== undefined || filter?.day !== undefined) {
      throw new RangeError("`year` is required when `month` or `day` is specified")
    }

    return undefined
  }

  return formatBlogDateFilter({ year: filter.year, month: filter.month, day: filter.day })
}

type FindImagesInHtmlOutput = {
  /** Absolute URL of parent `<a>` element `href` attribute. This may or may not be a link to a higher resolution image. */
  anchorElementUrl?: string
  /** `<img>` element `src` attribute */
  src: string
  /** Absolute URL of `<img>` element `src` attribute */
  srcUrl: string
}[]
export function findImagesInHtml(html: string, blogUrl: string | URL): FindImagesInHtmlOutput {
  const $ = cheerio.load(html, undefined, false)
  const imgElements = $("img")
  const images: FindImagesInHtmlOutput = []

  for (let imgElementIndex = 0; imgElementIndex < imgElements.length; imgElementIndex++) {
    const imgElement = imgElements[imgElementIndex]
    const src = $(imgElement).attr("src")
    if (src === undefined || src.trim() === "") {
      console.warn(`<img> element index ${imgElementIndex} has blank \`src\` attribute`)
      continue
    }

    const srcUrl = new URL(src, blogUrl)
    if (!srcUrl.protocol.startsWith("http")) {
      console.warn(`<img> element index ${imgElementIndex} has invalid protocol - ${srcUrl.href}`)
      continue
    }

    let anchorElementUrl: string | undefined
    try {
      const $parent = $(imgElement).parent().first()
      const parentHref = $parent.attr("href")
      if ($parent.get(0)?.tagName === "a" && parentHref !== undefined && parentHref.trim() !== "") {
        anchorElementUrl = new URL(parentHref, blogUrl).href
      }
    } catch (e) {
      console.warn(e)
    }

    images.push({
      anchorElementUrl,
      src,
      srcUrl: srcUrl.href
    })
  }

  return images
}

/** Extract blog UID from blog URL */
export function getUidFromUrl(url: string | URL): string | undefined {
  const { pathname } = url instanceof URL ? url : new URL(url)
  const match = pathname.match(/\/diary\/detail\/(\d+)/)
  if (match === null) return undefined
  return match[1]
}

import * as cheerio from "cheerio"

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

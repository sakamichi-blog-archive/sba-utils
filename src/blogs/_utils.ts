import * as cheerio from "cheerio"

type FindImagesInHtmlOutput = {
  /** Absolute URL of parent `<a>` element `href` attribute */
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

/** Parse the JSON argument from a JSONP callback string, e.g. `res({...})` */
export function parseJsonpArgument<T>(js: string, functionName: string): T | undefined {
  const match = js.trim().match(new RegExp(`^${functionName}\\(([\\s\\S]+)\\);?\\s*$`))
  if (!match) return undefined
  try {
    return JSON.parse(match[1]) as T
  } catch {
    return undefined
  }
}

/** Extract the numeric UID from a diary detail URL, e.g. `.../diary/detail/104660?...` → `104660` */
export function getUidFromUrl(url: string | URL): number | undefined {
  const { pathname } = url instanceof URL ? url : new URL(url)
  const match = pathname.match(/\/diary\/detail\/(\d+)/)
  if (match === null) return undefined
  return Number(match[1])
}

/**
 * Convert full-width numbers to half-width
 * @see {@link https://www.yoheim.net/blog.php?q=20191101}
 */
export function normalizeFullWidthNumbers(name: string): string {
  return name.replace(/[０-９]/g, str => String.fromCharCode(str.charCodeAt(0) - 0xfee0))
}

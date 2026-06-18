import * as cheerio from "cheerio"
import { parseScript } from "esprima"
import evaluate from "static-eval"

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

/** Get function argument in JavaScript string */
export function getJavaScriptArgument<T>(js: string, functionName: string): T | undefined {
  try {
    const ast = parseScript(js)
    let data: any

    // oxlint-disable-next-line eslint/no-unmodified-loop-condition
    for (let i = 0; data === undefined && i < ast.body.length; i++) {
      const body = ast.body[i]
      if (body?.type !== "ExpressionStatement") {
        continue
      }

      evaluate(body.expression, {
        [functionName]: (...args: any) => {
          data = args
        }
      })
    }

    return Array.isArray(data) && data.length === 1 ? data[0] : data
  } catch (e) {
    console.warn(e)
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

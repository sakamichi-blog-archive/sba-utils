import * as cheerio from "cheerio"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { parseDatetimeJst } from "../shared/datetime"
import { FetchStatusError, ParseError } from "../shared/errors"
import type { BlogWithHtml } from "./_types"
import { findImagesInHtml, getUidFromUrl } from "./_utils"

const BLOG_DETAIL_URL = "https://www.keyakizaka46.com/s/k46o/diary/detail"

/**
 * Fetch a single keyaki blog. The group is disbanded and its site frozen, but the blog pages are
 * still served, so past blogs remain readable.
 */
export async function fetchKeyakiBlog(
  uid: string
): Promise<{ blog: BlogWithHtml; html: string; url: string }> {
  const { html, url } = await fetchKeyakiBlogHtml(uid)
  return { blog: parseKeyakiBlogHtml(html, url), html, url }
}

export async function fetchKeyakiBlogHtml(uid: string): Promise<{ html: string; url: string }> {
  const url = getKeyakiBlogUrl(uid)
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT_DESKTOP
    }
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new FetchStatusError(response.status, response.url)
  }

  return { html: await response.text(), url }
}

export function getKeyakiBlogUrl(uid: string): string {
  return `${BLOG_DETAIL_URL}/${uid}?ima=0000&cd=member`
}

export function parseKeyakiBlogHtml(html: string, url: string): BlogWithHtml {
  const uid = getUidFromUrl(url)
  if (uid === undefined) throw new ParseError(`Cannot extract uid from URL: ${url}`)

  const $ = cheerio.load(html)
  const articleElement = $(".l-content .l-inner .box-content .box-main article").first()
  if (articleElement.length === 0) throw new ParseError("Article element not found in HTML")

  const headerElement = $(articleElement).find(".innerHead")

  /** `YYYY/MM/DD HH:mm` format. The `.innerHead` heading shows the date alone, without the time of day */
  const datetime = $(articleElement).find(".box-bottom ul li").first().text().trim()
  const contentHtml = $(articleElement).find(".box-article").html()?.trim() ?? ""

  return {
    datetime: parseDatetimeJst(datetime),
    html: contentHtml,
    images: findImagesInHtml(contentHtml, url),
    memberName: $(headerElement).find(".box-ttl p.name").text().trim(),
    title: $(headerElement).find(".box-ttl h3").text().trim(),
    uid,
    url
  }
}

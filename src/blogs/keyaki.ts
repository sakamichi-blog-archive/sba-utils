import * as cheerio from "cheerio"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDatetimeJst } from "../shared/datetime"
import { formatOptionalDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import type { BlogListFilter, BlogWithHtml } from "./_types"
import { findImagesInHtml, getUidFromUrl } from "./_utils"

const BLOG_DETAIL_URL = "https://www.keyakizaka46.com/s/k46o/diary/detail"
const BLOGS_PAGE_URL = "https://www.keyakizaka46.com/s/k46o/diary/member/list"

/** Fetch a single Keyaki blog. The site is frozen, so its blogs end on 2020-10-13 */
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

/** Fetch a page of Keyaki blogs, oldest first. The site is frozen, so its blogs end on 2020-10-13 */
export async function fetchKeyakiBlogs(filter?: BlogListFilter): Promise<{
  blogs: BlogWithHtml[]
  html: string
  url: string
}> {
  const { html, url } = await fetchKeyakiBlogsHtml(filter)
  return { blogs: parseKeyakiBlogsHtml(html), html, url }
}

export async function fetchKeyakiBlogsHtml(
  filter?: BlogListFilter
): Promise<{ html: string; url: string }> {
  const params = new URLSearchParams({ ima: getMmss(), cd: "member" })
  const dy = formatOptionalDy(filter)
  if (dy !== undefined) params.set("dy", dy)
  const page = filter?.page ?? 0
  if (page !== 0) params.set("page", String(page))
  if (filter?.memberUid !== undefined) params.set("ct", filter.memberUid)

  const url = `${BLOGS_PAGE_URL}?${params}`
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

/** Parse a blog listing page. Returned oldest first, reversing the site's newest-first order. */
export function parseKeyakiBlogsHtml(html: string): BlogWithHtml[] {
  const $ = cheerio.load(html)
  const blogElements = $(".l-content .l-inner .box-content .box-main article")
  const blogs: BlogWithHtml[] = []

  for (let blogElementIndex = 0; blogElementIndex < blogElements.length; blogElementIndex++) {
    const blogElement = blogElements[blogElementIndex]
    const titleElement = $(blogElement).find(".innerHead .box-ttl h3 a").first()
    const href = titleElement.attr("href")
    if (href === undefined) {
      console.error(`Failed to extract href from blog element index ${blogElementIndex}. Skipping.`)
      continue
    }

    const url = new URL(href, BLOGS_PAGE_URL)
    const uid = getUidFromUrl(url)
    if (!uid) {
      console.error(`Failed to extract UID from URL. Skipping - ${url.href}`)
      continue
    }

    /** `YYYY/MM/DD HH:mm` format, followed by the detail-page link in the same list */
    const datetimeText = $(blogElement).find(".box-bottom ul li").first().text().trim()
    let datetime: Date
    try {
      datetime = parseDatetimeJst(datetimeText)
    } catch (error) {
      console.error(`Failed to parse datetime for blog ${uid}. Skipping.`, error)
      continue
    }

    const contentHtml = $(blogElement).find(".box-article").first().html()?.trim() ?? ""

    blogs.push({
      datetime,
      html: contentHtml,
      images: findImagesInHtml(contentHtml, url),
      memberName: $(blogElement).find(".innerHead .box-ttl p.name").text().trim(),
      title: titleElement.text().trim(),
      uid,
      url: url.href
    })
  }

  return blogs.reverse() // oxlint-disable-line unicorn/no-array-reverse
}

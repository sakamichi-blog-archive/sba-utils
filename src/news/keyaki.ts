import * as cheerio from "cheerio"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDateJst } from "../shared/datetime"
import { formatOptionalDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import type { News, NewsFilter, NewsWithHtml } from "./_types"

const NEWS_PAGE_URL = "https://www.keyakizaka46.com/s/k46o/news/list"
const NEWS_DETAIL_URL = "https://www.keyakizaka46.com/s/k46o/news/detail"

/**
 * Fetch a month — or a single day, with `day` — of Keyaki news, oldest first. Omit `filter` for the
 * site's default listing of most recent news, which spans several months rather than the current one.
 *
 * The group is disbanded and its site frozen, so the listing ends in October 2020.
 *
 * List news carry no `html`; fetch a single news with {@link fetchKeyakiNewsDetail} to get it.
 */
export async function fetchKeyakiNews(filter?: NewsFilter): Promise<{
  news: News[]
  html: string
  url: string
}> {
  const { html, url } = await fetchKeyakiNewsHtml(filter)
  return { news: parseKeyakiNewsHtml(html), html, url }
}

export async function fetchKeyakiNewsHtml(filter?: NewsFilter): Promise<{
  html: string
  url: string
}> {
  const url = getKeyakiNewsUrl(filter)
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

/** Unlike the other groups, the detail page lists no members, so this returns no `members` */
export async function fetchKeyakiNewsDetail(id: string): Promise<{
  newsDetail: NewsWithHtml
  html: string
  url: string
}> {
  const { html, url } = await fetchKeyakiNewsDetailHtml(id)
  return { newsDetail: parseKeyakiNewsDetailHtml(html, url), html, url }
}

export async function fetchKeyakiNewsDetailHtml(id: string): Promise<{
  html: string
  url: string
}> {
  const url = getKeyakiNewsDetailUrl(id)
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

/** Build the news listing URL for a month or day, or — when `filter` is omitted — for the most recent news */
export function getKeyakiNewsUrl(filter?: NewsFilter): string {
  const params = new URLSearchParams({ ima: getMmss() })
  const dy = formatOptionalDy(filter)
  if (dy !== undefined) params.set("dy", dy)
  const page = filter?.page ?? 0
  if (page !== 0) params.set("page", String(page))

  return `${NEWS_PAGE_URL}?${params}`
}

export function getKeyakiNewsDetailUrl(id: string): string {
  return `${NEWS_DETAIL_URL}/${id}?ima=${getMmss()}`
}

/** Parse a news listing page. Returned oldest first, reversing the site's newest-first order. */
export function parseKeyakiNewsHtml(html: string): News[] {
  const $ = cheerio.load(html)
  const elements = $(".box-news > ul > li")
  const news: News[] = []

  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    const href = $(element).find("div.text a").first().attr("href")
    if (href === undefined) {
      console.error(`Failed to extract href from news index ${elementIndex}. Skipping.`)
      continue
    }

    const url = new URL(href, NEWS_PAGE_URL)
    const id = getIdFromUrl(url)
    if (id === undefined) {
      console.error(`Failed to extract id from URL. Skipping - ${url.href}`)
      continue
    }

    const dateText = $(element).find("div.date").first().text().trim()
    let date: Date
    try {
      date = parseDateJst(dateText)
    } catch (error) {
      console.error(`Failed to parse date for news ${id}. Skipping.`, error)
      continue
    }

    const categoryElement = $(element).find("div.category").first()

    news.push({
      categoryKey: getCategoryKey(categoryElement.attr("class") ?? ""),
      categoryName: categoryElement.text().trim(),
      date,
      id,
      title: $(element).find("div.text a").first().text().trim(),
      url: url.href
    })
  }

  return news.reverse() // oxlint-disable-line unicorn/no-array-reverse
}

export function parseKeyakiNewsDetailHtml(html: string, url: string): NewsWithHtml {
  const id = getIdFromUrl(url)
  if (id === undefined) throw new ParseError(`Cannot extract id from URL: ${url}`)

  const $ = cheerio.load(html)
  const articleElement = $(".box-news_detail").first()
  if (articleElement.length === 0) throw new ParseError("Article element not found in HTML")

  const headerElement = $(articleElement).find(".headarea").first()
  const categoryElement = $(headerElement).find("div.category").first()

  return {
    categoryKey: getCategoryKey(categoryElement.attr("class") ?? ""),
    categoryName: categoryElement.text().trim(),
    /** `YYYY年M月D日` format, unlike the listing's `YYYY.MM.DD` */
    date: parseDateJst($(headerElement).find("time").first().text().trim()),
    html: $(articleElement).find(".box-content .box-float .article").first().html()?.trim() ?? "",
    id,
    title: $(headerElement).find("h3").first().text().trim(),
    url
  }
}

/**
 * Extract the category key from a `class` attribute of the form `category shakehands` — the key is
 * a bare token beside `category`, with no prefix to key it off, unlike the other groups.
 */
function getCategoryKey(classAttr: string): string {
  return classAttr.split(/\s+/).find(token => token !== "" && token !== "category") ?? ""
}

/** Extract news id from a news detail URL */
function getIdFromUrl(url: string | URL): string | undefined {
  const { pathname } = url instanceof URL ? url : new URL(url)
  return pathname.match(/\/news\/detail\/([^/?]+)/)?.[1]
}

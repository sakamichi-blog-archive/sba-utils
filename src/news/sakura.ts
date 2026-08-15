import * as cheerio from "cheerio"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDateJst } from "../shared/datetime"
import { formatOptionalDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import { getCategoryKeyFromClass } from "../shared/html"
import type { News, NewsDetail, NewsFilter } from "./_types"

const NEWS_PAGE_URL = "https://sakurazaka46.com/s/s46/news/list"
const NEWS_DETAIL_URL = "https://sakurazaka46.com/s/s46/news/detail"

/**
 * Maps `cate-xxx` class keys to Japanese labels, used as a fallback when the visible label is empty and
 * the page's own category nav could not be read.
 */
const SAKURA_NEWS_CATEGORIES: Record<string, string> = {
  audition: "オーディション",
  event: "イベント情報",
  fanclub: "ファンクラブ",
  goods: "グッズ",
  media: "メディア",
  other: "その他",
  release: "リリース",
  shakehands: "ミート＆グリート",
  ticket: "チケット"
}

/**
 * Fetch a month — or a single day, with `day` — of Sakura news, oldest first. Omit `filter` for the site's default listing of most recent
 * news, which spans several months rather than the current one.
 *
 * List news carry no `html` or `members`; fetch a single news with {@link fetchSakuraNewsDetail} to get those.
 */
export async function fetchSakuraNews(filter?: NewsFilter): Promise<{
  news: News[]
  html: string
  url: string
}> {
  const { html, url } = await fetchSakuraNewsHtml(filter)
  return { news: parseSakuraNewsHtml(html), html, url }
}

export async function fetchSakuraNewsHtml(filter?: NewsFilter): Promise<{
  html: string
  url: string
}> {
  const url = getSakuraNewsUrl(filter)
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

export async function fetchSakuraNewsDetail(id: string): Promise<{
  newsDetail: NewsDetail
  html: string
  url: string
}> {
  const { html, url } = await fetchSakuraNewsDetailHtml(id)
  return { newsDetail: parseSakuraNewsDetailHtml(html, url), html, url }
}

export async function fetchSakuraNewsDetailHtml(id: string): Promise<{
  html: string
  url: string
}> {
  const url = getSakuraNewsDetailUrl(id)
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
export function getSakuraNewsUrl(filter?: NewsFilter): string {
  const params = new URLSearchParams({ ima: getMmss() })
  const dy = formatOptionalDy(filter)
  if (dy !== undefined) params.set("dy", dy)

  return `${NEWS_PAGE_URL}?${params}`
}

export function getSakuraNewsDetailUrl(id: string): string {
  return `${NEWS_DETAIL_URL}/${id}?ima=${getMmss()}`
}

/**
 * Parse the page's own category nav into a `cate-xxx` key to label map. Returns an empty object when the
 * nav is absent, in which case callers fall back to {@link SAKURA_NEWS_CATEGORIES}.
 */
export function parseSakuraNewsCategoriesHtml(html: string): Record<string, string> {
  const $ = cheerio.load(html)
  const categories: Record<string, string> = {}

  const elements = $(".com-hero-nav li")
  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    // The "ALL" and member-select links carry no `cd=` and are not categories
    if (!($(element).find("a").first().attr("href") ?? "").includes("cd=")) continue

    const key = getCategoryKeyFromClass($(element).attr("class") ?? "", "cate-")
    const label = $(element).find("a").first().text().trim()
    if (key !== undefined && key !== "" && label !== "") categories[key] = label
  }

  return categories
}

/** Parse a news listing page. Returned oldest first, reversing the site's newest-first order. */
export function parseSakuraNewsHtml(html: string): News[] {
  const $ = cheerio.load(html)
  const categories = { ...SAKURA_NEWS_CATEGORIES, ...parseSakuraNewsCategoriesHtml(html) }
  const elements = $("ul.com-news-part li.box")
  const news: News[] = []

  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    const href = $(element).find("a").first().attr("href")
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

    const categoryKey = getCategoryKeyFromClass($(element).attr("class") ?? "", "cate-")
    if (categoryKey === undefined) {
      console.error(`Failed to extract category key for news ${id}. Skipping.`)
      continue
    }

    const dateText = $(element).find("div.title-part p.date").first().text().trim()
    let date: Date
    try {
      date = parseDateJst(dateText)
    } catch (error) {
      console.error(`Failed to parse date for news ${id}. Skipping.`, error)
      continue
    }

    news.push({
      categoryKey,
      categoryName:
        $(element).find("div.title-part p.type").first().text().trim() || categories[categoryKey],
      date,
      group: "sakura",
      id,
      title: $(element).find("p.lead").first().text().trim(),
      url: url.href
    })
  }

  return news.reverse() // oxlint-disable-line unicorn/no-array-reverse
}

export function parseSakuraNewsDetailHtml(html: string, url: string): NewsDetail {
  const id = getIdFromUrl(url)
  if (id === undefined) throw new ParseError(`Cannot extract id from URL: ${url}`)

  const $ = cheerio.load(html)
  const articleElement = $(".news-detailcont .post .com-news-part > div").first()
  if (articleElement.length === 0) throw new ParseError("Article element not found in HTML")

  const categories = { ...SAKURA_NEWS_CATEGORIES, ...parseSakuraNewsCategoriesHtml(html) }
  const categoryKey = getCategoryKeyFromClass($(articleElement).attr("class") ?? "", "cate-")
  if (categoryKey === undefined) throw new ParseError("Category not found in HTML")

  const members: string[] = []
  const memberElements = $(articleElement).find("div.taglist span")
  for (let memberIndex = 0; memberIndex < memberElements.length; memberIndex++) {
    const memberName = $(memberElements[memberIndex]).text().replace(/\s/g, "")
    if (memberName !== "") members.push(memberName)
  }

  return {
    categoryKey,
    categoryName:
      $(articleElement).find("div.title-part p.type").first().text().trim() ||
      categories[categoryKey],
    date: parseDateJst($(articleElement).find("div.title-part p.date").first().text().trim()),
    group: "sakura",
    html: $(articleElement).find("div.article").first().html()?.trim() ?? "",
    id,
    members,
    title: $(articleElement).find("p.lead").first().text().trim(),
    url
  }
}

/** Extract news id from a news detail URL */
function getIdFromUrl(url: string | URL): string | undefined {
  const { pathname } = url instanceof URL ? url : new URL(url)
  return pathname.match(/\/news\/detail\/([^/?]+)/)?.[1]
}

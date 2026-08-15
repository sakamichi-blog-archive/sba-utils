import * as cheerio from "cheerio"

import { parseHinataCategoryNav } from "../shared/categories"
import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDateJst } from "../shared/datetime"
import { formatOptionalDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import { getCategoryKeyFromClass } from "../shared/html"
import type { News, NewsDetail, NewsFilter } from "./_types"

const NEWS_PAGE_URL = "https://www.hinatazaka46.com/s/official/news/list"
const NEWS_DETAIL_URL = "https://www.hinatazaka46.com/s/official/news/detail"

/**
 * Maps `category_xxx` class keys to Japanese labels, used as a fallback when the visible label is empty
 * and the page's own category nav could not be read. Note the fan club key is `fanclubonly`, which differs
 * from the `cd=fanclub` query value the nav links use.
 */
const HINATA_NEWS_CATEGORIES: Record<string, string> = {
  audition: "オーディション",
  event: "イベント",
  fanclubonly: "ファンクラブ",
  goods: "グッズ",
  media: "メディア",
  other: "その他",
  release: "リリース",
  shakehands: "ミート＆グリート",
  ticket: "チケット"
}

/**
 * Fetch a month — or a single day, with `day` — of Hinata news, oldest first. Omit `filter` for the
 * site's default listing of most recent news, which spans several months rather than the current one.
 *
 * List news carry no `html` or `members`; fetch a single news with {@link fetchHinataNewsDetail} to get those.
 */
export async function fetchHinataNews(filter?: NewsFilter): Promise<{
  news: News[]
  html: string
  url: string
}> {
  const { html, url } = await fetchHinataNewsHtml(filter)
  return { news: parseHinataNewsHtml(html), html, url }
}

export async function fetchHinataNewsHtml(filter?: NewsFilter): Promise<{
  html: string
  url: string
}> {
  const url = getHinataNewsUrl(filter)
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

export async function fetchHinataNewsDetail(id: string): Promise<{
  newsDetail: NewsDetail
  html: string
  url: string
}> {
  const { html, url } = await fetchHinataNewsDetailHtml(id)
  return { newsDetail: parseHinataNewsDetailHtml(html, url), html, url }
}

export async function fetchHinataNewsDetailHtml(id: string): Promise<{
  html: string
  url: string
}> {
  const url = getHinataNewsDetailUrl(id)
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
export function getHinataNewsUrl(filter?: NewsFilter): string {
  const params = new URLSearchParams({ ima: getMmss() })
  const dy = formatOptionalDy(filter)
  if (dy !== undefined) params.set("dy", dy)

  return `${NEWS_PAGE_URL}?${params}`
}

export function getHinataNewsDetailUrl(id: string): string {
  return `${NEWS_DETAIL_URL}/${id}?ima=${getMmss()}`
}

/**
 * Parse the page's own category nav into a `category_xxx` key to label map. Returns an empty object when
 * the nav is absent, in which case callers fall back to {@link HINATA_NEWS_CATEGORIES}.
 */
export function parseHinataNewsCategoriesHtml(html: string): Record<string, string> {
  return parseHinataCategoryNav(html)
}

/** Parse a news listing page. Returned oldest first, reversing the site's newest-first order. */
export function parseHinataNewsHtml(html: string): News[] {
  const $ = cheerio.load(html)
  const categories = { ...HINATA_NEWS_CATEGORIES, ...parseHinataNewsCategoriesHtml(html) }
  const elements = $(".l-maincontents--news ul.p-news__list li.p-news__item > a")
  const news: News[] = []

  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    const href = $(element).attr("href")
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

    const dateText = $(element).find("time.c-news__date").first().text().trim()
    let date: Date
    try {
      date = parseDateJst(dateText)
    } catch (error) {
      console.error(`Failed to parse date for news ${id}. Skipping.`, error)
      continue
    }

    const categoryElement = $(element).find(".c-news__category").first()
    const categoryKey = getCategoryKeyFromClass(categoryElement.attr("class") ?? "", "category_")
    if (categoryKey === undefined) {
      console.error(`Failed to extract category key for news ${id}. Skipping.`)
      continue
    }

    const categoryName = categoryElement.text().trim() || categories[categoryKey]
    if (categoryName === undefined || categoryName === "") {
      console.error(`Failed to resolve category name for news ${id}. Skipping.`)
      continue
    }

    news.push({
      categoryKey,
      categoryName,
      date,
      id,
      title: $(element).find("p.c-news__text").first().text().trim(),
      url: url.href
    })
  }

  return news.reverse() // oxlint-disable-line unicorn/no-array-reverse
}

export function parseHinataNewsDetailHtml(html: string, url: string): NewsDetail {
  const id = getIdFromUrl(url)
  if (id === undefined) throw new ParseError(`Cannot extract id from URL: ${url}`)

  const $ = cheerio.load(html)
  const articleElement = $(".l-maincontents--news-detail").first()
  if (articleElement.length === 0) throw new ParseError("Article element not found in HTML")

  const categories = { ...HINATA_NEWS_CATEGORIES, ...parseHinataNewsCategoriesHtml(html) }
  const categoryElement = $(articleElement).find(".p-article__info .c-news__category").first()
  const categoryKey = getCategoryKeyFromClass(categoryElement.attr("class") ?? "", "category_")
  if (categoryKey === undefined) throw new ParseError("Category not found in HTML")

  const categoryName = categoryElement.text().trim() || categories[categoryKey]
  if (categoryName === undefined || categoryName === "") {
    throw new ParseError(`Cannot resolve category name for key: ${categoryKey}`)
  }

  const members: string[] = []
  const memberElements = $(articleElement).find(".c-article__tag > a")
  for (let memberIndex = 0; memberIndex < memberElements.length; memberIndex++) {
    const memberName = $(memberElements[memberIndex]).text().replace(/\s/g, "")
    if (memberName !== "") members.push(memberName)
  }

  return {
    categoryKey,
    categoryName,
    date: parseDateJst($(articleElement).find(".p-article__info time.c-news__date").text().trim()),
    html: $(articleElement).find(".p-article__text").html()?.trim() ?? "",
    id,
    members,
    title: $(articleElement).find(".c-article__title").text().trim(),
    url
  }
}

/** Extract news id from a news detail URL */
function getIdFromUrl(url: string | URL): string | undefined {
  const { pathname } = url instanceof URL ? url : new URL(url)
  return pathname.match(/\/news\/detail\/([^/?]+)/)?.[1]
}

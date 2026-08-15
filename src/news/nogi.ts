import * as cheerio from "cheerio"
import * as z from "zod"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDateJst, parseDatetimeJst } from "../shared/datetime"
import { formatOptionalDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import { getCategoryKeyFromClass } from "../shared/html"
import { parseJsonpArgumentJson } from "../shared/jsonp"
import type { NewsFilter, NewsWithHtml } from "./_types"

/** Unlike the other groups, Nogi news carry a time of day and their detail HTML comes with the listing */
export interface NogiNews extends NewsWithHtml {
  /** Publication date and time (JST). Only the listing exposes it; the detail page shows a date alone */
  datetime: Date
}

const NEWS_PAGE_URL = "https://www.nogizaka46.com/s/n46/news/list"
const NEWS_API_ENDPOINT = "https://www.nogizaka46.com/s/n46/api/list/news"
const NEWS_DETAIL_URL = "https://www.nogizaka46.com/s/n46/news/detail"

/**
 * The API also returns `arti_code`, which — unlike the schedule API's field of the same name — does not
 * hold member IDs, so it is ignored. Nogi news expose no member data.
 */
const newsApiSchema = z.object({
  data: z.array(
    z.object({
      /** Category key */
      cate: z.string(),
      /** UID, unique per news */
      code: z.string(),
      /** `YYYY/MM/DD HH:mm:ss` format */
      date: z.string(),
      /** Absolute URL of the detail page */
      link_url: z.string(),
      /** Detail HTML */
      text: z.string(),
      title: z.string()
    })
  )
})

/**
 * Fetch a month — or a single day, with `day` — of Nogi news, oldest first. Omit `filter` for the
 * site's default listing of most recent news, which spans several months rather than the current one.
 *
 * Unlike the other groups, the listing already carries each news' detail `html`, so there is no separate
 * detail fetch. The API exposes only category keys, so the listing page is fetched alongside it to resolve
 * their labels; if that request fails, the news carry a `categoryKey` and an empty `categoryName`.
 */
export async function fetchNogiNews(filter?: NewsFilter): Promise<{
  news: NogiNews[]
  js: string
  url: string
}> {
  const [{ js, url }, categories] = await Promise.all([
    fetchNogiNewsJs(filter),
    fetchNogiNewsCategories(filter)
  ])
  return { news: parseNogiNewsJs(js, categories), js, url }
}

/**
 * Fetch a single Nogi news by id.
 *
 * Unlike {@link fetchNogiNews}, this reaches a news of any age without knowing which month it falls in.
 * The detail page shows a date but no time of day, so the result carries no `datetime` — take it from
 * {@link NogiNews.datetime} when you have the listing entry. The page lists no members.
 */
export async function fetchNogiNewsDetail(id: string): Promise<{
  newsDetail: NewsWithHtml
  html: string
  url: string
}> {
  const { html, url } = await fetchNogiNewsDetailHtml(id)
  return { newsDetail: parseNogiNewsDetailHtml(html, url), html, url }
}

export async function fetchNogiNewsDetailHtml(id: string): Promise<{
  html: string
  url: string
}> {
  const url = getNogiNewsDetailUrl(id)
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

/**
 * Fetch the listing page's category nav and parse it into a `cate` key to label map. Returns an empty
 * object rather than throwing, so that a news fetch is never lost to a label lookup.
 */
export async function fetchNogiNewsCategories(
  filter?: NewsFilter
): Promise<Record<string, string>> {
  try {
    const params = new URLSearchParams({ ima: getMmss() })
    const dy = formatOptionalDy(filter)
    if (dy !== undefined) params.set("dy", dy)

    const response = await fetch(`${NEWS_PAGE_URL}?${params}`, {
      headers: {
        "User-Agent": USER_AGENT_DESKTOP
      }
    })
    if (response.status !== 200) {
      await response.body?.cancel()
      throw new FetchStatusError(response.status, response.url)
    }

    return parseNogiNewsCategoriesHtml(await response.text())
  } catch (error) {
    console.error("Failed to fetch news categories. News will carry an empty category name.", error)
    return {}
  }
}

export async function fetchNogiNewsJs(filter?: NewsFilter): Promise<{
  js: string
  url: string
}> {
  const ima = getMmss()
  const url = getNogiNewsUrl(filter, ima)

  const refererParams = new URLSearchParams({ ima })
  const dy = formatOptionalDy(filter)
  if (dy !== undefined) refererParams.set("dy", dy)

  const response = await fetch(url, {
    headers: {
      Referer: `${NEWS_PAGE_URL}?${refererParams}`,
      "User-Agent": USER_AGENT_DESKTOP
    }
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new FetchStatusError(response.status, response.url)
  }

  return { js: await response.text(), url }
}

/** Build the news API URL for a month or day, or — when `filter` is omitted — for the most recent news */
export function getNogiNewsUrl(filter?: NewsFilter, ima = getMmss()): string {
  const params = new URLSearchParams({ ima })
  const dy = formatOptionalDy(filter)
  if (dy !== undefined) params.set("dy", dy)
  params.set("callback", "res")

  return `${NEWS_API_ENDPOINT}?${params}`
}

/**
 * Build the detail-page URL for a single news by its {@link NogiNews.id}. The URL omits the `ima` value
 * carried by the API's own link; use {@link NogiNews.url} to keep it.
 */
export function getNogiNewsDetailUrl(id: string): string {
  return `${NEWS_DETAIL_URL}/${id}?ima=${getMmss()}`
}

/**
 * Parse the listing page's category nav into a `cate` key to label map. Returns an empty object when the
 * nav is absent.
 */
export function parseNogiNewsCategoriesHtml(html: string): Record<string, string> {
  const $ = cheerio.load(html)
  const categories: Record<string, string> = {}

  const elements = $(`.cat_sel_list a[data-param="ct"]`)
  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    // The "ALL" link carries an empty `data-value` and is not a category
    const key = $(element).attr("data-value") ?? ""
    const label = $(element).text().trim()
    if (key !== "" && label !== "") categories[key] = label
  }

  return categories
}

export function parseNogiNewsDetailHtml(html: string, url: string): NewsWithHtml {
  const id = getIdFromUrl(url)
  if (id === undefined) throw new ParseError(`Cannot extract id from URL: ${url}`)

  const $ = cheerio.load(html)
  const headerElement = $("main .post_header").first()
  if (headerElement.length === 0) throw new ParseError("Article element not found in HTML")

  return {
    categoryKey:
      getCategoryKeyFromClass(
        $(headerElement).find(".post_header_cat .cat_icon").attr("class") ?? "",
        "i--"
      ) ?? "",
    categoryName: $(headerElement).find(".post_header_cat .cat_name").first().text().trim(),
    date: parseDateJst($(headerElement).find(".post_header_data span").first().text().trim()),
    // `.post_body_in` excludes the prev/next nav and latest-news list that share `.post_body`
    html: $("main .post_body .post_body_in").first().html()?.trim() ?? "",
    id,
    title: $(headerElement).find("h1").first().text().trim(),
    url
  }
}

/**
 * Parse a news API response. Returned oldest first, reversing the API's newest-first order.
 *
 * Pass `categories` — from {@link fetchNogiNewsCategories} or {@link parseNogiNewsCategoriesHtml} — to
 * resolve category keys to the labels the site displays. Without it `categoryName` is an empty string.
 */
export function parseNogiNewsJs(js: string, categories: Record<string, string> = {}): NogiNews[] {
  const functionArgument = parseJsonpArgumentJson(js, "res")
  if (functionArgument === undefined) {
    throw new ParseError("Failed to find JavaScript function argument")
  }

  const { data } = newsApiSchema.parse(functionArgument)
  const news: NogiNews[] = []

  for (const item of data) {
    let date: Date
    let datetime: Date
    try {
      date = parseDateJst(item.date)
      datetime = parseDatetimeJst(item.date)
    } catch (error) {
      console.error(`Failed to parse date for news ${item.code}. Skipping.`, error)
      continue
    }

    news.push({
      categoryKey: item.cate,
      categoryName: categories[item.cate] ?? "",
      date,
      datetime,
      html: item.text.trim(),
      id: item.code,
      title: item.title.trim(),
      url: new URL(item.link_url, NEWS_PAGE_URL).href
    })
  }

  return news.reverse() // oxlint-disable-line unicorn/no-array-reverse
}

/** Extract news id from a news detail URL */
function getIdFromUrl(url: string | URL): string | undefined {
  const { pathname } = url instanceof URL ? url : new URL(url)
  return pathname.match(/\/news\/detail\/([^/?]+)/)?.[1]
}

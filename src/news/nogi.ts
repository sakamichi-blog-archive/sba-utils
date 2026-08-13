import * as z from "zod"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDateJst, parseDatetimeJst } from "../shared/datetime"
import { formatOptionalDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import { parseJsonpArgumentJson } from "../shared/jsonp"
import type { NewsFilter, NewsWithHtml } from "./_types"

/** Unlike the other groups, Nogi news carry a time of day and their detail HTML comes with the listing */
export interface NogiNews extends NewsWithHtml {
  datetime: Date
}

const NEWS_PAGE_URL = "https://www.nogizaka46.com/s/n46/news/list"
const NEWS_API_ENDPOINT = "https://www.nogizaka46.com/s/n46/api/list/news"
const NEWS_DETAIL_URL = "https://www.nogizaka46.com/s/n46/news/detail"

/** Maps API `cate` keys to the Japanese labels shown on the site */
const NOGI_NEWS_CATEGORIES: Record<string, string> = {
  book: "書籍",
  goods: "グッズ",
  live: "ライブ/イベント",
  meet: "握手会",
  meetandgreet: "ミート＆グリート",
  mobile: "モバイル・アプリ",
  movie: "映画",
  musical: "舞台/ミュージカル",
  other: "その他",
  photo_book: "写真集",
  radio: "ラジオ",
  release: "CD/音楽配信/映像商品",
  streaming: "映像配信サービス",
  tieup: "タイアップ・CM",
  tv: "テレビ",
  web: "WEB"
}

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
 * Fetch a month of Nogi news, oldest first. Omit `filter` for the site's default listing of most recent
 * news, which spans several months rather than the current one.
 *
 * Unlike the other groups, the listing already carries each news' detail `html`, so there is no separate
 * detail fetch.
 */
export async function fetchNogiNews(filter?: NewsFilter): Promise<{
  news: NogiNews[]
  js: string
  url: string
}> {
  const { js, url } = await fetchNogiNewsJs(filter)
  return { news: parseNogiNewsJs(js), js, url }
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

/** Build the news API URL for a month, or — when `filter` is omitted — for the most recent news */
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

/** Parse a news API response. Returned oldest first, reversing the API's newest-first order. */
export function parseNogiNewsJs(js: string): NogiNews[] {
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
      category: NOGI_NEWS_CATEGORIES[item.cate] ?? item.cate,
      date,
      datetime,
      group: "nogi",
      html: item.text.trim(),
      id: item.code,
      title: item.title.trim(),
      url: new URL(item.link_url, NEWS_PAGE_URL).href
    })
  }

  return news.reverse() // oxlint-disable-line unicorn/no-array-reverse
}

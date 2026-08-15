import * as cheerio from "cheerio"
import * as z from "zod"

import { members as nogiMembers } from "../members/nogi"
import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getDatePartsJst, getMmss, parseDateJst } from "../shared/datetime"
import { formatDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import { getCategoryKeyFromClass } from "../shared/html"
import { parseJsonpArgumentJson } from "../shared/jsonp"
import type { ScheduleEventWithHtml, ScheduleFilter } from "./_types"
import { normalizeTime, parseScheduleTimeRange } from "./_utils"

/** Unlike {@link ScheduleEventWithHtml}, `url` is always present — the API gives every event a detail URL */
export interface NogiScheduleEvent extends ScheduleEventWithHtml {
  url: string
}

/**
 * A Nogi schedule event as rendered on its own detail page.
 *
 * Unlike {@link NogiScheduleEvent} it carries no `members`: the page names nobody, and the API's member
 * data is only in the listing. Take `members` from the list event.
 */
export interface NogiScheduleEventDetail extends Omit<ScheduleEventWithHtml, "members"> {
  url: string
}

const SCHEDULE_PAGE_URL = "https://www.nogizaka46.com/s/n46/media/list"
const SCHEDULE_API_ENDPOINT = "https://www.nogizaka46.com/s/n46/api/list/schedule"
const SCHEDULE_DETAIL_URL = "https://www.nogizaka46.com/s/n46/media/detail"

const scheduleApiSchema = z.object({
  data: z.array(
    z.object({
      /** Member IDs (official website), grouped */
      arti_code: z.array(z.array(z.string())),
      /** Category key */
      cate: z.string(),
      /** UID, unique per event */
      code: z.string(),
      /** `YYYY/MM/DD` format */
      date: z.string(),
      /** `HH:mm` format, or empty string */
      end_time: z.string(),
      /** URL */
      link: z.string(),
      /** `HH:mm` format, or empty string */
      start_time: z.string(),
      /** Detail HTML */
      text: z.string(),
      /** Title */
      title: z.string()
    })
  )
})

/**
 * Fetch a month of Nogi schedule events. The API exposes only category keys, so the listing page is
 * fetched alongside it to resolve their labels, and a failure there fails the call. A key the nav does not
 * cover resolves to an empty `categoryName`.
 */
export async function fetchNogiScheduleEvents(filter: ScheduleFilter): Promise<{
  events: NogiScheduleEvent[]
  js: string
  /** The listing page these events came from, as for the other groups — not the JSONP endpoint behind it */
  url: string
}> {
  const ima = getMmss()
  // `allSettled` so that a second failure cannot surface as an unhandled rejection
  const [jsResult, categoriesResult] = await Promise.allSettled([
    fetchNogiScheduleEventsJs(filter, ima),
    fetchNogiScheduleCategories(filter, ima)
  ])
  if (jsResult.status === "rejected") throw jsResult.reason
  if (categoriesResult.status === "rejected") throw categoriesResult.reason

  const { js } = jsResult.value
  return {
    events: parseNogiScheduleEventsJs(js, categoriesResult.value),
    js,
    url: getNogiScheduleUrl(filter, ima)
  }
}

/**
 * Fetch a single schedule event by its {@link NogiScheduleEvent.id}.
 *
 * The page renders everything the listing does except `members`, so this is only worth calling when you
 * have an id but no list event.
 *
 * An id identifies an event, not one occurrence of it, so pass `occurrence` — a
 * {@link NogiScheduleEvent.date} — for anything recurring. Without it the page reports the date the event
 * was first listed: a weekly radio show appearing under 2026/08/01 reports 2026/04/04, its first airing,
 * and a `birthday` reports the year its entry was created rather than the year of birth.
 */
export async function fetchNogiScheduleEvent(
  id: string,
  occurrence?: Date
): Promise<{
  event: NogiScheduleEventDetail
  html: string
  url: string
}> {
  const { html, url } = await fetchNogiScheduleEventHtml(id, occurrence)
  return { event: parseNogiScheduleEventHtml(html, url), html, url }
}

export async function fetchNogiScheduleEventHtml(
  id: string,
  occurrence?: Date
): Promise<{
  html: string
  url: string
}> {
  const url = getNogiScheduleEventUrl(id, occurrence)
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
 * Fetch the listing page's category nav and parse it into a `cate` key to label map.
 *
 * The nav is the same whichever month is requested, so `filter` only steers the page fetched and may be
 * omitted; the map it returns can be reused across calls.
 *
 * Throws if the page cannot be fetched — an unreachable site is a real failure, not a missing label. A
 * page that loads but carries no nav returns an empty map instead, leaving every `categoryName` empty.
 */
export async function fetchNogiScheduleCategories(
  filter?: ScheduleFilter,
  ima = getMmss()
): Promise<Record<string, string>> {
  const response = await fetch(getNogiScheduleUrl(filter, ima), {
    headers: {
      "User-Agent": USER_AGENT_DESKTOP
    }
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new FetchStatusError(response.status, response.url)
  }

  return parseNogiScheduleCategoriesHtml(await response.text())
}

/**
 * Parse the listing page's category nav into a `cate` key to label map. Returns an empty object when the
 * nav is absent.
 */
export function parseNogiScheduleCategoriesHtml(html: string): Record<string, string> {
  const $ = cheerio.load(html)
  const categories: Record<string, string> = {}

  // Unlike the news nav's anchors, the schedule filter is radio inputs paired with a `<label>`
  const elements = $(`.js-catLink input[name="ct"]`)
  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    // The "ALL" input carries an empty `value` and is not a category
    const key = $(element).attr("value") ?? ""
    const id = $(element).attr("id")
    const label = $(element).closest(".js-catLink").find(`label[for="${id}"]`).text().trim()
    if (key !== "" && label !== "") categories[key] = label
  }

  return categories
}

/**
 * Unlike {@link fetchNogiScheduleEvents}, the returned `url` is the JSONP endpoint — the URL that produced
 * `js`
 */
export async function fetchNogiScheduleEventsJs(
  filter: ScheduleFilter,
  ima = getMmss()
): Promise<{
  js: string
  url: string
}> {
  const url = getNogiScheduleJsUrl(filter, ima)
  const response = await fetch(url, {
    headers: {
      Referer: getNogiScheduleUrl(filter, ima),
      "User-Agent": USER_AGENT_DESKTOP
    }
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new FetchStatusError(response.status, response.url)
  }

  return { js: await response.text(), url }
}

/**
 * Build the schedule listing page URL for a month. This is the page a reader would open; the JSONP
 * endpoint behind it is an implementation detail.
 */
export function getNogiScheduleUrl(filter?: ScheduleFilter, ima = getMmss()): string {
  const params = new URLSearchParams({ ima })
  if (filter !== undefined) params.set("dy", formatDy(filter))

  return `${SCHEDULE_PAGE_URL}?${params}`
}

/** Build the JSONP endpoint URL backing {@link getNogiScheduleUrl} */
function getNogiScheduleJsUrl(filter: ScheduleFilter, ima = getMmss()): string {
  const params = new URLSearchParams({ ima, dy: formatDy(filter), callback: "res" })
  return `${SCHEDULE_API_ENDPOINT}?${params}`
}

/**
 * Build the detail-page URL for a single event by its {@link NogiScheduleEvent.id}.
 *
 * Pass `occurrence` — a {@link NogiScheduleEvent.date} — for a recurring event. The page renders whichever
 * date the `wd00`/`wd01`/`wd02` parameters carry, so without it the page falls back to the date the event
 * was first listed. The site echoes them without checking them against the event, so a date the event does
 * not actually fall on is displayed just the same.
 *
 * The URL still omits the `pri1=YYYYMM` month breadcrumb that the API's link includes, so the detail page's
 * back-to-list navigation falls back to the current month. Use {@link NogiScheduleEvent.url} when that
 * context matters.
 */
export function getNogiScheduleEventUrl(id: string, occurrence?: Date): string {
  const params = new URLSearchParams({ ima: getMmss() })
  if (occurrence !== undefined) {
    const { year, month, day } = getDatePartsJst(occurrence)
    params.set("wd00", String(year))
    params.set("wd01", String(month).padStart(2, "0"))
    params.set("wd02", String(day).padStart(2, "0"))
  }

  return `${SCHEDULE_DETAIL_URL}/${id}?${params}`
}

/**
 * Parse a schedule event's detail page. `url` is the page the HTML came from; it supplies the returned
 * `url` and `id`.
 *
 * Unlike the listing, the page displays its own category label, so no category map is needed.
 */
export function parseNogiScheduleEventHtml(html: string, url: string): NogiScheduleEventDetail {
  const $ = cheerio.load(html)
  const headerElement = $("header.m--dehd").first()
  if (headerElement.length === 0) throw new ParseError("Header element not found in HTML")

  const categoryElement = headerElement.find(".m--dehd__tag__i").first()
  // The second `m--pstdata__p` is the content type ("SCHEDULE"), not a date
  const dateText = headerElement.find(".m--pstdata__p").first().text().trim()
  const { timeStart, timeEnd } = parseScheduleTimeRange(
    headerElement.find(".m--dehd__sctm").first().text().trim()
  )

  return {
    categoryKey: getCategoryKeyFromClass(categoryElement.attr("class") ?? "", "i--") ?? "",
    categoryName: headerElement.find(".m--dehd__tag__name").first().text().trim(),
    date: parseDateJst(dateText),
    // Scoped to the editable section: `.sd--de` alone also holds the prev/next nav and a LATEST list
    html: $(".sd--de .m--scedit").first().html()?.trim() ?? "",
    id: new URL(url).pathname.match(/\/detail\/([^/?]+)/)?.[1],
    timeEnd,
    timeStart,
    title: headerElement.find("h1.c--dettl").first().text().trim(),
    url
  }
}

/**
 * Parse a schedule API response.
 *
 * Pass `categories` — from {@link fetchNogiScheduleCategories} or {@link parseNogiScheduleCategoriesHtml} —
 * to resolve category keys to the labels the site displays. Without it `categoryName` is an empty string.
 */
export function parseNogiScheduleEventsJs(
  js: string,
  categories: Record<string, string> = {}
): NogiScheduleEvent[] {
  const functionArgument = parseJsonpArgumentJson(js, "res")
  if (functionArgument === undefined) {
    throw new ParseError("Failed to find JavaScript function argument")
  }

  const { data } = scheduleApiSchema.parse(functionArgument)
  const events: NogiScheduleEvent[] = []

  for (const event of data) {
    let date: Date
    try {
      date = parseDateJst(event.date)
    } catch (error) {
      console.error(`Failed to parse date for event ${event.code}. Skipping.`, error)
      continue
    }

    const members: string[] = []
    for (const memberId of event.arti_code.flat()) {
      const member = nogiMembers.find(_member => _member.uid === memberId)
      if (member !== undefined) members.push(member.name)
    }

    events.push({
      categoryKey: event.cate,
      categoryName: categories[event.cate] ?? "",
      date,
      html: event.text.trim(),
      id: event.code,
      members,
      timeEnd: normalizeTime(event.end_time),
      timeStart: normalizeTime(event.start_time),
      title: event.title.trim(),
      url: new URL(event.link, SCHEDULE_PAGE_URL).href
    })
  }

  return events
}

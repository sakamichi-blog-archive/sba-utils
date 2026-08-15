import * as cheerio from "cheerio"
import * as z from "zod"

import { members as nogiMembers } from "../members/nogi"
import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDateJst } from "../shared/datetime"
import { formatDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import { parseJsonpArgumentJson } from "../shared/jsonp"
import type { ScheduleEventWithHtml, ScheduleFilter } from "./_types"
import { normalizeTime } from "./_utils"

/** Unlike {@link ScheduleEventWithHtml}, `url` is always present — the API gives every event a unique detail URL */
export interface NogiScheduleEvent extends ScheduleEventWithHtml {
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
 * Build the detail-page URL for a single event by its {@link NogiScheduleEvent.id}. The id alone resolves
 * the correct event, but the URL omits the `pri1=YYYYMM` month breadcrumb that the API's link includes, so
 * the detail page's back-to-list navigation falls back to the current month. Use {@link NogiScheduleEvent.url}
 * when that context matters.
 */
export function getNogiScheduleEventUrl(id: string): string {
  return `${SCHEDULE_DETAIL_URL}/${id}?ima=${getMmss()}`
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

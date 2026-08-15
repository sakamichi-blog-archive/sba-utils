import * as z from "zod"

import { members as nogiMembers } from "../members/nogi"
import { parseNogiScheduleCategoryNav } from "../shared/categories"
import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDateJst } from "../shared/datetime"
import { formatDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import { parseJsonpArgumentJson } from "../shared/jsonp"
import type { ScheduleEventWithHtml, ScheduleFilter } from "./_types"
import { normalizeTime } from "./_utils"

/** Unlike {@link ScheduleEventWithHtml}, `url` is always present — the API gives every event a unique detail URL */
export interface NogiScheduleEvent extends Omit<ScheduleEventWithHtml, "categoryName"> {
  /**
   * Unlike every other event, this may be absent: the API returns the category key alone, so the label is
   * resolved against the site's category nav and a key too new to appear there has none.
   */
  categoryName?: string
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
 * fetched alongside it to resolve their labels; if that request fails, the events carry a `categoryKey`
 * but no `categoryName`.
 */
export async function fetchNogiScheduleEvents(filter: ScheduleFilter): Promise<{
  events: NogiScheduleEvent[]
  js: string
  url: string
}> {
  const [{ js, url }, categories] = await Promise.all([
    fetchNogiScheduleEventsJs(filter),
    fetchNogiScheduleCategories(filter)
  ])
  return { events: parseNogiScheduleEventsJs(js, categories), js, url }
}

/**
 * Fetch the listing page's category nav and parse it into a `cate` key to label map. Returns an empty
 * object rather than throwing, so that a schedule fetch is never lost to a label lookup.
 */
export async function fetchNogiScheduleCategories(
  filter: ScheduleFilter
): Promise<Record<string, string>> {
  try {
    const params = new URLSearchParams({ ima: getMmss(), dy: formatDy(filter) })
    const response = await fetch(`${SCHEDULE_PAGE_URL}?${params}`, {
      headers: {
        "User-Agent": USER_AGENT_DESKTOP
      }
    })
    if (response.status !== 200) {
      await response.body?.cancel()
      throw new FetchStatusError(response.status, response.url)
    }

    return parseNogiScheduleCategoriesHtml(await response.text())
  } catch (error) {
    console.error("Failed to fetch schedule categories. Events will carry no category name.", error)
    return {}
  }
}

/**
 * Parse the listing page's category nav into a `cate` key to label map. Returns an empty object when the
 * nav is absent.
 */
export function parseNogiScheduleCategoriesHtml(html: string): Record<string, string> {
  return parseNogiScheduleCategoryNav(html)
}

export async function fetchNogiScheduleEventsJs(filter: ScheduleFilter): Promise<{
  js: string
  url: string
}> {
  const ima = getMmss()
  const url = getNogiScheduleUrl(filter, ima)
  const dy = formatDy(filter)
  const referer = `${SCHEDULE_PAGE_URL}?${new URLSearchParams({ ima, dy })}`
  const response = await fetch(url, {
    headers: {
      Referer: referer,
      "User-Agent": USER_AGENT_DESKTOP
    }
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new FetchStatusError(response.status, response.url)
  }

  return { js: await response.text(), url }
}

export function getNogiScheduleUrl(filter: ScheduleFilter, ima = getMmss()): string {
  const params = new URLSearchParams({
    ima,
    dy: formatDy(filter),
    callback: "res"
  })
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
 * to resolve category keys to the labels the site displays. Without it the events carry no `categoryName`.
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
      categoryName: categories[event.cate],
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

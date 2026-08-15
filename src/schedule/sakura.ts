import * as cheerio from "cheerio"

import { parseSakuraCategoryNav } from "../shared/categories"
import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDateJst } from "../shared/datetime"
import { formatDy } from "../shared/dy"
import { FetchStatusError } from "../shared/errors"
import { getCategoryKeyFromClass } from "../shared/html"
import type { ScheduleEventWithHtml, ScheduleFilter } from "./_types"
import { parseScheduleTimeRange } from "./_utils"

/** Unlike {@link ScheduleEventWithHtml}, has no `url` — the detail lives in an on-page modal with no standalone URL */
export type SakuraScheduleEvent = Omit<ScheduleEventWithHtml, "url">

const SCHEDULE_PAGE_URL = "https://sakurazaka46.com/s/s46/media/list"

/** Maps `cate-xxx` class keys to Japanese labels, used as a fallback when the visible label is empty */
const SAKURA_SCHEDULE_CATEGORIES: Record<string, string> = {
  birthday: "誕生日",
  event: "イベント情報",
  goods: "グッズ",
  media: "メディア",
  other: "その他",
  release: "リリース",
  shakehands: "ミート＆グリート",
  ticket: "チケット"
}

export async function fetchSakuraScheduleEvents(filter: ScheduleFilter): Promise<{
  events: SakuraScheduleEvent[]
  html: string
  url: string
}> {
  const { html, url } = await fetchSakuraScheduleEventsHtml(filter)
  return { events: parseSakuraScheduleEventsHtml(html), html, url }
}

export async function fetchSakuraScheduleEventsHtml(filter: ScheduleFilter): Promise<{
  html: string
  url: string
}> {
  const url = getSakuraScheduleUrl(filter)
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
 * Build the schedule listing URL for a month, or — when `day` is given — for a specific date.
 *
 * Sakura events have no standalone detail URL (the detail is an on-page modal), so a date-scoped listing
 * is the closest thing to a per-event link: pass the `year`/`month`/`day` of a {@link SakuraScheduleEvent}'s
 * date to deep-link to the listing that contains it. The page still shows the whole month.
 */
export function getSakuraScheduleUrl(filter: ScheduleFilter & { day?: number }): string {
  const params = new URLSearchParams({ ima: getMmss(), dy: formatDy(filter) })
  return `${SCHEDULE_PAGE_URL}?${params}`
}

/**
 * Parse the page's own category nav into a `cate-xxx` key to label map. Returns an empty object when the
 * nav is absent, in which case callers fall back to {@link SAKURA_SCHEDULE_CATEGORIES}.
 */
export function parseSakuraScheduleCategoriesHtml(html: string): Record<string, string> {
  return parseSakuraCategoryNav(html)
}

export function parseSakuraScheduleEventsHtml(html: string): SakuraScheduleEvent[] {
  const $ = cheerio.load(html)
  const categories = { ...SAKURA_SCHEDULE_CATEGORIES, ...parseSakuraScheduleCategoriesHtml(html) }
  const modals = $(".module-modal.js-schedule-detail")
  const events: SakuraScheduleEvent[] = []

  for (let modalIndex = 0; modalIndex < modals.length; modalIndex++) {
    const modal = modals[modalIndex]
    const container = $(modal).find(".mordal-box .inner > div").first()

    const dateText = $(container).find(".txt p.date").text().trim()
    let date: Date
    try {
      date = parseDateJst(dateText)
    } catch (error) {
      console.error(`Failed to parse date for modal index ${modalIndex}. Skipping.`, error)
      continue
    }

    const categoryKey = getCategoryKeyFromClass($(container).attr("class") ?? "", "cate-")
    const categoryName =
      $(container).find(".txt p.type").first().text().trim() || categories[categoryKey ?? ""]
    if (categoryKey === undefined || categoryName === undefined || categoryName === "") {
      console.error(`Failed to resolve category for modal index ${modalIndex}. Skipping.`)
      continue
    }
    const { timeStart, timeEnd } = parseScheduleTimeRange(dateText)

    const members: string[] = []
    const memberElements = $(container).find(".memlist ul.members li a")
    for (let memberIndex = 0; memberIndex < memberElements.length; memberIndex++) {
      const memberName = $(memberElements[memberIndex]).text().replace(/\s/g, "")
      if (memberName !== "") members.push(memberName)
    }

    events.push({
      categoryKey,
      categoryName,
      date,
      html: $(container).find(".txt p.lead").html()?.trim() ?? "",
      id: ($(modal).attr("class") ?? "").match(/count_(\d+)_/)?.[1],
      members,
      timeEnd,
      timeStart,
      title: $(container).find(".txt h2.title").text().trim()
    })
  }

  return events
}

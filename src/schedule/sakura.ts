import * as cheerio from "cheerio"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss } from "../shared/datetime"
import { FetchStatusError } from "../shared/errors"
import type { ScheduleEventWithHtml, ScheduleFilter } from "./_types"
import {
  formatScheduleDy,
  parseScheduleDate,
  parseScheduleTimeRange,
  resolveCategoryFromClass
} from "./_utils"

const SCHEDULE_PAGE_URL = "https://sakurazaka46.com/s/s46/media/list"

/** Maps `cate-xxx` class keys to Japanese labels, used as a fallback when the visible label is empty */
const SAKURA_SCHEDULE_CATEGORIES: Record<string, string> = {
  birthday: "誕生日",
  event: "イベント",
  goods: "グッズ",
  media: "メディア",
  other: "その他",
  release: "リリース",
  shakehands: "握手会",
  ticket: "チケット"
}

export async function fetchSakuraScheduleEvents(filter: ScheduleFilter): Promise<{
  events: ScheduleEventWithHtml[]
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

export function getSakuraScheduleUrl(filter: ScheduleFilter): string {
  const params = new URLSearchParams({ ima: getMmss(), dy: formatScheduleDy(filter) })
  return `${SCHEDULE_PAGE_URL}?${params}`
}

export function parseSakuraScheduleEventsHtml(html: string): ScheduleEventWithHtml[] {
  const $ = cheerio.load(html)
  const modals = $(".module-modal.js-schedule-detail")
  const events: ScheduleEventWithHtml[] = []

  for (let modalIndex = 0; modalIndex < modals.length; modalIndex++) {
    const modal = modals[modalIndex]
    const container = $(modal).find(".mordal-box .inner > div").first()

    const dateText = $(container).find(".txt p.date").text().trim()
    let date: Date
    try {
      date = parseScheduleDate(dateText)
    } catch (error) {
      console.error(`Failed to parse date for modal index ${modalIndex}. Skipping.`, error)
      continue
    }

    const category =
      $(container).find(".txt p.type").first().text().trim() ||
      resolveCategoryFromClass(
        $(container).attr("class") ?? "",
        "cate-",
        SAKURA_SCHEDULE_CATEGORIES
      )
    const { timeStart, timeEnd } = parseScheduleTimeRange(dateText)

    const members: string[] = []
    const memberElements = $(container).find(".memlist ul.members li a")
    for (let memberIndex = 0; memberIndex < memberElements.length; memberIndex++) {
      const memberName = $(memberElements[memberIndex]).text().replace(/\s/g, "")
      if (memberName !== "") members.push(memberName)
    }

    events.push({
      category,
      date,
      group: "sakura",
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

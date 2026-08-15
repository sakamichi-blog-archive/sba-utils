import * as cheerio from "cheerio"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDateJst } from "../shared/datetime"
import { formatDy } from "../shared/dy"
import { FetchStatusError, ParseError } from "../shared/errors"
import { resolveCategoryFromClass } from "../shared/html"
import type { ScheduleEvent, ScheduleEventWithHtml, ScheduleFilter } from "./_types"
import { parseScheduleTimeRange } from "./_utils"

const SCHEDULE_PAGE_URL = "https://www.hinatazaka46.com/s/official/media/list"
const SCHEDULE_DETAIL_URL = "https://www.hinatazaka46.com/s/official/media/detail"

/** Maps `category_xxx` class keys to Japanese labels, used as a fallback when the visible label is empty */
const HINATA_SCHEDULE_CATEGORIES: Record<string, string> = {
  birth: "誕生日",
  event: "イベント",
  goods: "グッズ",
  media: "メディア",
  other: "その他",
  release: "リリース",
  shakehands: "握手会",
  ticket: "チケット"
}

/**
 * A Hinata schedule list event. Unlike the other groups' list events, these carry no `html` or `members`;
 * fetch a single event with {@link fetchHinataScheduleEvent} to get those (see {@link HinataScheduleEventDetail}).
 */
export type HinataScheduleEvent = Omit<ScheduleEvent, "members">

/** Unlike {@link ScheduleEventWithHtml}, `date` may be absent (e.g. birthdays) — take it from the list event instead */
export interface HinataScheduleEventDetail extends Omit<ScheduleEventWithHtml, "date"> {
  date?: Date
}

export async function fetchHinataScheduleEvents(filter: ScheduleFilter): Promise<{
  events: HinataScheduleEvent[]
  html: string
  url: string
}> {
  const { html, url } = await fetchHinataScheduleEventsHtml(filter)
  return { events: parseHinataScheduleEventsHtml(html), html, url }
}

export async function fetchHinataScheduleEventsHtml(filter: ScheduleFilter): Promise<{
  html: string
  url: string
}> {
  const url = getHinataScheduleUrl(filter)
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

export async function fetchHinataScheduleEvent(id: string): Promise<{
  event: HinataScheduleEventDetail
  html: string
  url: string
}> {
  const { html, url } = await fetchHinataScheduleEventHtml(id)
  return { event: parseHinataScheduleEventHtml(html, url), html, url }
}

export async function fetchHinataScheduleEventHtml(id: string): Promise<{
  html: string
  url: string
}> {
  const url = getHinataScheduleEventUrl(id)
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

export function getHinataScheduleUrl(filter: ScheduleFilter): string {
  const params = new URLSearchParams({ ima: getMmss(), dy: formatDy(filter) })
  return `${SCHEDULE_PAGE_URL}?${params}`
}

export function getHinataScheduleEventUrl(id: string): string {
  return `${SCHEDULE_DETAIL_URL}/${id}?ima=${getMmss()}`
}

export function parseHinataScheduleEventsHtml(html: string): HinataScheduleEvent[] {
  const $ = cheerio.load(html)

  const pageDate = $(".l-maincontents--schedule .p-schedule__page_date")
    .first()
    .text()
    .replace(/\D/g, "")
  const yearMonth = pageDate.match(/^(\d{4})(\d{2})$/)
  if (yearMonth === null) throw new ParseError(`Cannot parse schedule year/month: ${pageDate}`)

  const [, year, month] = yearMonth
  const events: HinataScheduleEvent[] = []

  const dayGroups = $(".l-maincontents--schedule ul .p-schedule__list-group")
  for (let dayIndex = 0; dayIndex < dayGroups.length; dayIndex++) {
    const dayGroup = dayGroups[dayIndex]
    const day = $(dayGroup).find(".c-schedule__date--list span").first().text().replace(/\D/g, "")
    if (day === "") continue

    let date: Date
    try {
      date = parseDateJst(`${year}/${month}/${day}`)
    } catch (error) {
      console.error(`Failed to parse date for day index ${dayIndex}. Skipping.`, error)
      continue
    }

    const elements = $(dayGroup).find("ul.p-schedule__list li.p-schedule__item > a")
    for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
      const element = elements[elementIndex]
      const href = $(element).attr("href")
      if (href === undefined) {
        console.error(`Failed to extract href from event index ${elementIndex}. Skipping.`)
        continue
      }

      const url = new URL(href, SCHEDULE_PAGE_URL)
      const categoryElement = $(element).find(".p-schedule__head .c-schedule__category").first()
      const category =
        categoryElement.text().trim() ||
        resolveCategoryFromClass(
          categoryElement.attr("class") ?? "",
          "category_",
          HINATA_SCHEDULE_CATEGORIES
        )

      const { timeStart, timeEnd } = parseScheduleTimeRange(
        $(element).find("div.p-schedule__head div.c-schedule__time--list").first().text().trim()
      )

      events.push({
        category,
        date,
        id: url.pathname.match(/\/detail\/([^/?]+)/)?.[1],
        timeEnd,
        timeStart,
        title: $(element).find("p.c-schedule__text").first().text().trim(),
        url: url.href
      })
    }
  }

  return events
}

export function parseHinataScheduleEventHtml(html: string, url: string): HinataScheduleEventDetail {
  const $ = cheerio.load(html)
  const articleElement = $(
    "main.l-main section.l-section .l-container .l-contents .l-maincontents--schedule-detail"
  ).first()
  if (articleElement.length === 0) throw new ParseError("Article element not found in HTML")

  const categoryElement = $(articleElement).find(".p-article__info .c-schedule__category")
  const category =
    categoryElement.text().trim() ||
    resolveCategoryFromClass(
      categoryElement.attr("class") ?? "",
      "category_",
      HINATA_SCHEDULE_CATEGORIES
    )

  const dateText = $(articleElement).find(".p-article__info .c-schedule__date b").text().trim()
  const { timeStart, timeEnd } = parseScheduleTimeRange(
    $(articleElement).find(".p-article__info .c-schedule__date span").text().trim()
  )

  const members: string[] = []
  const memberElements = $(articleElement).find(".c-article__tag > a")
  for (let memberIndex = 0; memberIndex < memberElements.length; memberIndex++) {
    const memberName = $(memberElements[memberIndex]).text().replace(/\s/g, "")
    if (memberName !== "") members.push(memberName)
  }

  return {
    category,
    date: dateText !== "" ? parseDateJst(dateText) : undefined,
    html: $(articleElement).find(".p-article__text").html()?.trim() ?? "",
    id: new URL(url).pathname.match(/\/detail\/([^/?]+)/)?.[1],
    members,
    timeEnd,
    timeStart,
    title: $(articleElement).find(".c-article__title").text().trim(),
    url
  }
}

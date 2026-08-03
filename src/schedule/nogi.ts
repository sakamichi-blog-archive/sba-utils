import * as z from "zod"

import { members as nogiMembers } from "../members/nogi"
import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss } from "../shared/datetime"
import { FetchStatusError, ParseError } from "../shared/errors"
import { parseJsonpArgumentJson } from "../shared/jsonp"
import type { ScheduleEventWithHtml, ScheduleFilter } from "./_types"
import { formatScheduleDy, normalizeTime, parseScheduleDate } from "./_utils"

const SCHEDULE_PAGE_URL = "https://www.nogizaka46.com/s/n46/media/list"
const SCHEDULE_API_ENDPOINT = "https://www.nogizaka46.com/s/n46/api/list/schedule"

/** Maps API `cate` keys to the Japanese labels shown on the site */
const NOGI_SCHEDULE_CATEGORIES: Record<string, string> = {
  birthday: "誕生日",
  book: "書籍",
  live: "ライブ/イベント",
  meet: "握手会",
  mobile: "モバイル",
  movie: "映画",
  musical: "舞台/ミュージカル",
  other: "その他",
  radio: "ラジオ",
  release: "リリース",
  tv: "TV",
  web: "WEB"
}

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

export async function fetchNogiScheduleEvents(filter: ScheduleFilter): Promise<{
  events: ScheduleEventWithHtml[]
  js: string
  url: string
}> {
  const { js, url } = await fetchNogiScheduleEventsJs(filter)
  return { events: parseNogiScheduleEventsJs(js), js, url }
}

export async function fetchNogiScheduleEventsJs(filter: ScheduleFilter): Promise<{
  js: string
  url: string
}> {
  const url = getNogiScheduleUrl(filter)
  const dy = formatScheduleDy(filter)
  const referer = `${SCHEDULE_PAGE_URL}?${new URLSearchParams({ ima: getMmss(), dy })}`
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

export function getNogiScheduleUrl(filter: ScheduleFilter): string {
  const params = new URLSearchParams({
    ima: getMmss(),
    dy: formatScheduleDy(filter),
    callback: "res"
  })
  return `${SCHEDULE_API_ENDPOINT}?${params}`
}

export function parseNogiScheduleEventsJs(js: string): ScheduleEventWithHtml[] {
  const functionArgument = parseJsonpArgumentJson(js, "res")
  if (functionArgument === undefined) {
    throw new ParseError("Failed to find JavaScript function argument")
  }

  const { data } = scheduleApiSchema.parse(functionArgument)

  return data.map<ScheduleEventWithHtml>(event => {
    const members: string[] = []
    for (const memberId of event.arti_code.flat()) {
      const member = nogiMembers.find(_member => _member.uid === memberId)
      if (member !== undefined) members.push(member.nameSpaced)
    }

    return {
      category: NOGI_SCHEDULE_CATEGORIES[event.cate] ?? event.cate,
      date: parseScheduleDate(event.date),
      group: "nogi",
      html: event.text.trim(),
      id: event.code,
      members,
      timeEnd: normalizeTime(event.end_time),
      timeStart: normalizeTime(event.start_time),
      title: event.title.trim(),
      url: new URL(event.link, SCHEDULE_PAGE_URL).href
    }
  })
}

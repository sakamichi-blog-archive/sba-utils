import * as cheerio from "cheerio"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

import { TIMEZONE_JAPAN, USER_AGENT_DESKTOP } from "../shared/constants"
import type { BlogWithHtml } from "./_types"
import { findImagesInHtml, getUidFromUrl } from "./_utils"

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

export interface SakuraBlog {
  /** Publish date, without time info */
  date: Date
  memberName: string
  title: string
  uid: number
  url: string
}

const DATE_FORMAT = "YYYY/M/DD"
const DATETIME_FORMAT = "YYYY/MM/DD HH:mm"
const BLOGS_PAGE_URL = "https://sakurazaka46.com/s/s46/diary/blog/list"

export async function fetchSakuraBlog(uid: number): Promise<BlogWithHtml> {
  const html = await fetchSakuraBlogHtml(uid)
  return parseSakuraBlogHtml(html, uid)
}

export async function fetchSakuraBlogs(): Promise<SakuraBlog[]> {
  const html = await fetchSakuraBlogsHtml()
  return parseSakuraBlogsHtml(html)
}

async function fetchSakuraBlogHtml(uid: number): Promise<string> {
  const response = await fetch(getSakuraBlogUrl(uid), {
    headers: {
      "User-Agent": USER_AGENT_DESKTOP
    }
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new Error(`Invalid status code ${response.status} - ${response.url}`)
  }

  return response.text()
}

export async function fetchSakuraBlogsHtml(): Promise<string> {
  const response = await fetch(`${BLOGS_PAGE_URL}?ima=${dayjs().format("mmss")}`, {
    headers: {
      "User-Agent": USER_AGENT_DESKTOP
    }
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new Error(`Invalid status code ${response.status} - ${response.url}`)
  }

  return response.text()
}

export function getSakuraBlogUrl(uid: number): string {
  return `https://sakurazaka46.com/s/s46/diary/detail/${uid}?ima=${dayjs().format("mmss")}&cd=blog`
}

function parseSakuraBlogHtml(html: string, uid: number): BlogWithHtml {
  const $ = cheerio.load(html)
  const articleElement = $("main.site-main .col2-wrap-in2 .col-l-wrap article.post").first()

  /** `YYYY/MM/DD HH:mm` format */
  const datetime = $(articleElement).find(".col-r .blog-foot .txt p.date").text()
  const contentHtml = $(articleElement).find(".col-r .box-article").html()?.trim() ?? ""
  const url = getSakuraBlogUrl(uid)

  return {
    datetime: dayjs.tz(datetime, DATETIME_FORMAT, TIMEZONE_JAPAN).toDate(),
    html: contentHtml,
    images: findImagesInHtml(contentHtml, url),
    memberName: $(articleElement).find(".col-r .blog-foot .txt p.name").text().trim(),
    title: $(articleElement).find(".col-r .title-wrap h1.title").text().trim(),
    uid,
    url
  }
}

export function parseSakuraBlogsHtml(html: string): SakuraBlog[] {
  const $ = cheerio.load(html)
  const blogElements = $(
    "main.site-main .blog-top ul.com-blog-part li.box, main.site-main .member-blog-listm ul.com-blog-part li.box"
  )
  const blogs: SakuraBlog[] = []

  for (let blogElementIndex = 0; blogElementIndex < blogElements.length; blogElementIndex++) {
    const blogElement = blogElements[blogElementIndex]
    const href = $(blogElement).find("a").attr("href")
    if (href === undefined) {
      console.error(`Failed to extract href from blog element index ${blogElementIndex}. Skipping.`)
      continue
    }

    /** `YYYY/M/DD` format */
    const date = $(blogElement).find("a .wrap-bg .txt .date-title p.date").text().trim()
    const url = new URL(href, BLOGS_PAGE_URL)
    const uid = getUidFromUrl(url)
    if (!uid) {
      console.error(`Failed to extract UID from URL. Skipping - ${url.href}`)
      continue
    }

    blogs.push({
      date: dayjs.tz(date, DATE_FORMAT, TIMEZONE_JAPAN).toDate(),
      memberName: $(blogElement).find("a .wrap-bg .txt .prof .prof-in p.name").text().trim(),
      title: $(blogElement).find("a .wrap-bg .txt .date-title h3.title").first().text().trim(),
      uid,
      url: url.href
    })
  }

  return blogs.reverse() // oxlint-disable-line unicorn/no-array-reverse
}

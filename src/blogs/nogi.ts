import * as cheerio from "cheerio"
import * as z from "zod"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDatetimeJst } from "../shared/datetime"
import { FetchStatusError, ParseError } from "../shared/errors"
import { parseJsonpArgumentJson } from "../shared/jsonp"
import { castStringToIntegerSchema } from "../shared/schemas"
import { normalizeFullWidthNumbers } from "../shared/text"
import type { BlogListFilter, BlogWithHtml } from "./_types"
import { findImagesInHtml, formatBlogDateFilter, getUidFromUrl } from "./_utils"

/** Date-filtered list page doesn't expose member name, unlike {@link BlogWithHtml} */
export interface NogiBlogSummary {
  datetime: Date
  title: string
  uid: number
  url: string
}

/** Unlike {@link BlogListFilter}, `year` is required — this fetch is always date-filtered */
export type NogiBlogsByDateFilter = BlogListFilter & { year: number }

/** Unlike {@link BlogListFilter}, has no date fields — the JSON API behind {@link fetchNogiBlogs} has no date filter */
export type NogiBlogsFilter = Pick<BlogListFilter, "page" | "memberUid">

const BLOGS_API_ENDPOINT = "https://www.nogizaka46.com/s/n46/api/list/blog"
const BLOGS_LIST_URL = "https://www.nogizaka46.com/s/n46/diary/MEMBER/list"
const BLOGS_API_PAGE_SIZE = 32

const getBlogsFunctionArgumentSchema = z.object({
  /** Blogs */
  data: z.array(
    z.object({
      /** UID */
      code: castStringToIntegerSchema,
      /** Local datetime in `YYYY/MM/DD HH:mm:ss` format */
      date: z.string(),
      /** URL */
      link: z.url(),
      /** Member name spaced */
      name: z.string(),
      /** Content HTML */
      text: z.string(),
      /** Title */
      title: z.string()
    })
  )
})

export async function fetchNogiBlog(
  uid: number
): Promise<{ blog: BlogWithHtml; html: string; url: string }> {
  const { html, url } = await fetchNogiBlogHtml(uid)
  return { blog: parseNogiBlogHtml(html, url), html, url }
}

export async function fetchNogiBlogHtml(uid: number): Promise<{ html: string; url: string }> {
  const url = getNogiBlogUrl(uid)
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

export async function fetchNogiBlogs(filter?: NogiBlogsFilter): Promise<{
  blogs: BlogWithHtml[]
  js: string
  url: string
}> {
  const { js, url } = await fetchNogiBlogsJs(filter)
  return { blogs: parseNogiBlogsJs(js), js, url }
}

export async function fetchNogiBlogsByDate(
  filter: NogiBlogsByDateFilter
): Promise<{ blogs: NogiBlogSummary[]; html: string; url: string }> {
  const { html, url } = await fetchNogiBlogsByDateHtml(filter)
  return { blogs: parseNogiBlogsByDateHtml(html), html, url }
}

export async function fetchNogiBlogsByDateHtml(
  filter: NogiBlogsByDateFilter
): Promise<{ html: string; url: string }> {
  const url = getNogiBlogsByDateUrl(filter)
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

export async function fetchNogiBlogsJs(filter?: NogiBlogsFilter): Promise<{
  js: string
  url: string
}> {
  const page = filter?.page ?? 0
  const params = new URLSearchParams({
    ima: getMmss(),
    rw: String(BLOGS_API_PAGE_SIZE),
    st: String(page * BLOGS_API_PAGE_SIZE),
    callback: "res"
  })
  if (filter?.memberUid !== undefined) params.set("ct", filter.memberUid)

  const url = `${BLOGS_API_ENDPOINT}?${params}`
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT_DESKTOP
    }
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new FetchStatusError(response.status, response.url)
  }

  return { js: await response.text(), url }
}

export function getNogiBlogUrl(uid: number): string {
  return `https://www.nogizaka46.com/s/n46/diary/detail/${uid}?ima=${getMmss()}`
}

export function getNogiBlogsByDateUrl(filter: NogiBlogsByDateFilter): string {
  const params = new URLSearchParams({
    ima: getMmss(),
    dy: formatBlogDateFilter({ year: filter.year, month: filter.month, day: filter.day })
  })
  const page = filter.page ?? 0
  if (page !== 0) params.set("page", String(page))
  if (filter.memberUid !== undefined) params.set("ct", filter.memberUid)
  return `${BLOGS_LIST_URL}?${params}`
}

export function parseNogiBlogHtml(html: string, url: string): BlogWithHtml {
  const uid = getUidFromUrl(url)
  if (uid === undefined) throw new ParseError(`Cannot extract uid from URL: ${url}`)

  const $ = cheerio.load(html)
  const articleElement = $(".b--wrap .b--cont main.b--mn .bd--mc")
  if (articleElement.length === 0) throw new ParseError("Article element not found in HTML")

  const headerElement = $(articleElement).find("header.bd--hd .bd--hd__in .bd--hd__data")

  /** `YYYY.MM.DD HH:mm` format */
  const datetime = $(headerElement).find(".bd--hd__sub p.bd--hd__date").text().trim()
  const contentHtml =
    $(articleElement).find(".bd--ctt .bd--ctt__in .bd--mn .bd--edit").html()?.trim() ?? ""

  return {
    datetime: parseDatetimeJst(datetime),
    html: contentHtml,
    images: findImagesInHtml(contentHtml, url),
    memberName: $(articleElement)
      .find(
        ".bd--ctt .bd--ctt__in .bd--mn .bd--aside .bd--aside__in .bd--prof .bd--prof__bg .bd--prof__in .bd--prof__tex a.bd--prof__tex__a p.bd--prof__name"
      )
      .text()
      .trim(),
    title: $(headerElement).find("h1.bd--hd__ttl").text().trim(),
    uid,
    url
  }
}

export function parseNogiBlogsByDateHtml(html: string): NogiBlogSummary[] {
  const $ = cheerio.load(html)
  const blogElements = $(".bl--wp .bl--list a.bl--card")
  const blogs: NogiBlogSummary[] = []

  for (let blogElementIndex = 0; blogElementIndex < blogElements.length; blogElementIndex++) {
    const blogElement = blogElements[blogElementIndex]
    const href = $(blogElement).attr("href")
    if (!href) {
      console.error(`Failed to extract href from blog element index ${blogElementIndex}. Skipping.`)
      continue
    }

    const url = new URL(href, BLOGS_LIST_URL)
    const uid = getUidFromUrl(url)
    if (!uid) {
      console.error(`Failed to extract UID from URL. Skipping - ${url.href}`)
      continue
    }

    /** `YYYY.MM.DD HH:mm` format */
    const datetime = $(blogElement).find(".bl--card__date").text().trim()

    blogs.push({
      datetime: parseDatetimeJst(datetime),
      title: $(blogElement).find(".bl--card__ttl").text().trim(),
      uid,
      url: url.href
    })
  }

  return blogs.reverse() // oxlint-disable-line unicorn/no-array-reverse
}

export function parseNogiBlogsJs(js: string): BlogWithHtml[] {
  const functionArgument = parseJsonpArgumentJson(js, "res")
  if (functionArgument === undefined) {
    throw new ParseError("Failed to find JavaScript function argument")
  }

  const { data } = getBlogsFunctionArgumentSchema.parse(functionArgument)

  return data
    .map<BlogWithHtml>(blog => {
      return {
        datetime: parseDatetimeJst(blog.date),
        html: blog.text.trim(),
        images: findImagesInHtml(blog.text, blog.link),
        memberName: normalizeFullWidthNumbers(blog.name.trim()),
        title: blog.title.trim(),
        uid: blog.code,
        url: blog.link
      }
    })
    .reverse() // oxlint-disable-line unicorn/no-array-reverse
}

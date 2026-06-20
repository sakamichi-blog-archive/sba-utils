import * as cheerio from "cheerio"
import * as z from "zod"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getIma, parseDatetimeJst } from "../shared/datetime"
import { FetchStatusError, ParseError } from "../shared/errors"
import { castStringToIntegerSchema } from "../shared/schemas"
import type { BlogWithHtml } from "./_types"
import { findImagesInHtml, getUidFromUrl, normalizeFullWidthNumbers, parseJsonpArgument } from "./_utils"

const BLOGS_API_ENDPOINT = "https://www.nogizaka46.com/s/n46/api/list/blog"

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

export async function fetchNogiBlog(uid: number): Promise<BlogWithHtml> {
  const { html, url } = await fetchNogiBlogHtml(uid)
  return parseNogiBlogHtml(html, url)
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

export async function fetchNogiBlogs(): Promise<BlogWithHtml[]> {
  const js = await fetchNogiBlogsJs()
  return parseNogiBlogsJs(js)
}

export async function fetchNogiBlogsJs(): Promise<string> {
  const params = new URLSearchParams({
    ima: getIma(),
    rw: "32",
    st: "0",
    callback: "res"
  })
  const response = await fetch(`${BLOGS_API_ENDPOINT}?${params}`, {
    headers: {
      "User-Agent": USER_AGENT_DESKTOP
    }
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new FetchStatusError(response.status, response.url)
  }

  return response.text()
}

export function getNogiBlogUrl(uid: number): string {
  return `https://www.nogizaka46.com/s/n46/diary/detail/${uid}?ima=${getIma()}`
}

export function parseNogiBlogHtml(html: string, url: string): BlogWithHtml {
  const uid = getUidFromUrl(url)
  if (uid === undefined) throw new Error(`Cannot extract uid from URL: ${url}`)

  const $ = cheerio.load(html)
  const articleElement = $(".b--wrap .b--cont main.b--mn .bd--mc")
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

export function parseNogiBlogsJs(js: string): BlogWithHtml[] {
  const functionArgument = parseJsonpArgument(js, "res")
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

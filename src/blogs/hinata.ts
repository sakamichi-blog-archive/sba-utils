import * as cheerio from "cheerio"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getMmss, parseDatetimeJst } from "../shared/datetime"
import { FetchStatusError, ParseError } from "../shared/errors"
import type { BlogWithHtml } from "./_types"
import { findImagesInHtml, getUidFromUrl } from "./_utils"

const BLOGS_PAGE_URL = "https://www.hinatazaka46.com/s/official/diary/member/list"

export async function fetchHinataBlog(
  uid: number
): Promise<{ blog: BlogWithHtml; html: string; url: string }> {
  const { html, url } = await fetchHinataBlogHtml(uid)
  return { blog: parseHinataBlogHtml(html, url), html, url }
}

export async function fetchHinataBlogHtml(uid: number): Promise<{ html: string; url: string }> {
  const url = getHinataBlogUrl(uid)
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

export async function fetchHinataBlogs(): Promise<{
  blogs: BlogWithHtml[]
  html: string
  url: string
}> {
  const { html, url } = await fetchHinataBlogsHtml()
  return { blogs: parseHinataBlogsHtml(html), html, url }
}

export async function fetchHinataBlogsHtml(): Promise<{ html: string; url: string }> {
  const url = `${BLOGS_PAGE_URL}?ima=${getMmss()}`
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

export function getHinataBlogUrl(uid: number): string {
  return `https://www.hinatazaka46.com/s/official/diary/detail/${uid}?ima=0000&cd=member`
}

export function parseHinataBlogHtml(html: string, url: string): BlogWithHtml {
  const uid = getUidFromUrl(url)
  if (uid === undefined) throw new ParseError(`Cannot extract uid from URL: ${url}`)

  const $ = cheerio.load(html)
  const articleElement = $(".l-maincontents--blog .p-blog-group .p-blog-article").first()
  if (articleElement.length === 0) throw new ParseError("Article element not found in HTML")

  /** `YYYY.M.D HH:mm` format */
  const datetime = $(articleElement)
    .find(".p-blog-article__head .p-blog-article__info .c-blog-article__date time")
    .text()
    .trim()
  const contentHtml = $(articleElement).find(".c-blog-article__text").first().html()?.trim() ?? ""

  return {
    datetime: parseDatetimeJst(datetime),
    html: contentHtml,
    images: findImagesInHtml(contentHtml, url),
    memberName: $(articleElement)
      .find(".p-blog-article__head .p-blog-article__info .c-blog-article__name")
      .text()
      .trim(),
    title: $(articleElement).find(".p-blog-article__head .c-blog-article__title").text().trim(),
    uid,
    url
  }
}

export function parseHinataBlogsHtml(html: string): BlogWithHtml[] {
  const $ = cheerio.load(html)
  const blogElements = $(
    ".l-contents--blog-list .l-maincontents--blog .p-blog-group .p-blog-article"
  )
  const blogs: BlogWithHtml[] = []

  for (let blogElementIndex = 0; blogElementIndex < blogElements.length; blogElementIndex++) {
    const blogElement = blogElements[blogElementIndex]
    const href = $(blogElement).find(".p-button__blog_detail a").first().attr("href")
    if (!href) {
      console.error(`Failed to extract href from blog element index ${blogElementIndex}. Skipping.`)
      continue
    }

    const contentHtml = $(blogElement).find(".c-blog-article__text").first().html()?.trim() || ""
    /** `YYYY.M.D HH:mm` format */
    const datetime = $(blogElement)
      .find(".p-blog-article__info .c-blog-article__date")
      .text()
      .trim()
    const url = new URL(href, BLOGS_PAGE_URL)
    const uid = getUidFromUrl(url)
    if (!uid) {
      console.error(`Failed to extract UID from URL. Skipping - ${url.href}`)
      continue
    }

    blogs.push({
      datetime: parseDatetimeJst(datetime),
      html: contentHtml,
      images: findImagesInHtml(contentHtml, url),
      memberName: $(blogElement).find(".p-blog-article__info .c-blog-article__name").text().trim(),
      title: $(blogElement).find(".c-blog-article__title").first().text().trim(),
      uid,
      url: url.href
    })
  }

  return blogs.reverse() // oxlint-disable-line unicorn/no-array-reverse
}

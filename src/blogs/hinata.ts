import * as cheerio from "cheerio"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getIma, parseDatetimeJst } from "../shared/datetime"
import { FetchStatusError } from "../shared/errors"
import type { BlogWithHtml } from "./_types"
import { findImagesInHtml, getUidFromUrl } from "./_utils"

const BLOGS_PAGE_URL = "https://www.hinatazaka46.com/s/official/diary/member/list"

export async function fetchHinataBlogs(): Promise<BlogWithHtml[]> {
  const html = await fetchHinataBlogsHtml()
  return parseHinataBlogsHtml(html)
}

export async function fetchHinataBlogsHtml(): Promise<string> {
  const response = await fetch(`${BLOGS_PAGE_URL}?ima=${getIma()}`, {
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

export async function fetchHinataBlog(uid: number): Promise<BlogWithHtml> {
  const html = await fetchHinataBlogHtml(uid)
  return parseHinataBlogHtml(html, uid)
}

export async function fetchHinataBlogHtml(uid: number): Promise<string> {
  const response = await fetch(getHinataBlogUrl(uid), {
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

export function getHinataBlogUrl(uid: number): string {
  return `https://www.hinatazaka46.com/s/official/diary/detail/${uid}?ima=0000&cd=member`
}

export function parseHinataBlogHtml(html: string, uid: number): BlogWithHtml {
  const $ = cheerio.load(html)
  const articleElement = $(".l-maincontents--blog .p-blog-group .p-blog-article").first()

  /** `YYYY.M.D HH:mm` format */
  const datetime = $(articleElement)
    .find(".p-blog-article__head .p-blog-article__info .c-blog-article__date time")
    .text()
    .trim()
  const contentHtml = $(articleElement).find(".c-blog-article__text").first().html()?.trim() ?? ""
  const url = getHinataBlogUrl(uid)

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

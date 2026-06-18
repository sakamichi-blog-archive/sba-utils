import * as z from "zod"

import { USER_AGENT_DESKTOP } from "../shared/constants"
import { getIma, parseDatetimeJst } from "../shared/datetime"
import { FetchStatusError } from "../shared/errors"
import { castStringToIntegerSchema } from "../shared/schemas"
import type { BlogWithHtml } from "./_types"
import { findImagesInHtml, getJavaScriptArgument, normalizeFullWidthNumbers } from "./_utils"

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

export function parseNogiBlogsJs(js: string): BlogWithHtml[] {
  const functionArgument = getJavaScriptArgument(js, "res")
  if (functionArgument === undefined) {
    throw new Error("Failed to find JavaScript function argument")
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

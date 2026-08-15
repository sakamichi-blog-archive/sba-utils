import * as cheerio from "cheerio"

import { getCategoryKeyFromClass } from "./html"

/**
 * Parse a Hinata category nav into a key to label map. The same markup serves the news and schedule
 * listings, so the caller decides which built-in map to fall back to. Returns an empty object when the nav
 * is absent.
 */
export function parseHinataCategoryNav(html: string): Record<string, string> {
  const $ = cheerio.load(html)
  const categories: Record<string, string> = {}

  const elements = $("ul.p-category__list a.c-button-category")
  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    // The "ALL" link carries no `cd=` and is not a category
    if (!($(element).attr("href") ?? "").includes("cd=")) continue

    const key = getCategoryKeyFromClass($(element).attr("class") ?? "", "category_")
    const label = $(element).text().trim()
    if (key !== undefined && key !== "" && label !== "") categories[key] = label
  }

  return categories
}

/**
 * Parse a Sakura category nav into a key to label map. The same markup serves the news and schedule
 * listings, so the caller decides which built-in map to fall back to. Returns an empty object when the nav
 * is absent.
 */
export function parseSakuraCategoryNav(html: string): Record<string, string> {
  const $ = cheerio.load(html)
  const categories: Record<string, string> = {}

  const elements = $(".com-hero-nav li")
  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    // The "ALL" and member-select links carry no `cd=` and are not categories
    if (!($(element).find("a").first().attr("href") ?? "").includes("cd=")) continue

    const key = getCategoryKeyFromClass($(element).attr("class") ?? "", "cate-")
    const label = $(element).find("a").first().text().trim()
    if (key !== undefined && key !== "" && label !== "") categories[key] = label
  }

  return categories
}

/**
 * Parse a Nogi news category nav into a `cate` key to label map. Returns an empty object when the nav is
 * absent. Nogi's schedule listing uses different markup — see {@link parseNogiScheduleCategoryNav}.
 */
export function parseNogiNewsCategoryNav(html: string): Record<string, string> {
  const $ = cheerio.load(html)
  const categories: Record<string, string> = {}

  const elements = $(`.cat_sel_list a[data-param="ct"]`)
  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    // The "ALL" link carries an empty `data-value` and is not a category
    const key = $(element).attr("data-value") ?? ""
    const label = $(element).text().trim()
    if (key !== "" && label !== "") categories[key] = label
  }

  return categories
}

/**
 * Parse a Nogi schedule category nav into a `cate` key to label map. Unlike the news nav, the schedule
 * filter is built from radio inputs paired with a `<label>`. Returns an empty object when the nav is absent.
 */
export function parseNogiScheduleCategoryNav(html: string): Record<string, string> {
  const $ = cheerio.load(html)
  const categories: Record<string, string> = {}

  const elements = $(`.js-catLink input[name="ct"]`)
  for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
    const element = elements[elementIndex]
    // The "ALL" input carries an empty `value` and is not a category
    const key = $(element).attr("value") ?? ""
    const id = $(element).attr("id")
    const label = $(element).closest(".js-catLink").find(`label[for="${id}"]`).text().trim()
    if (key !== "" && label !== "") categories[key] = label
  }

  return categories
}

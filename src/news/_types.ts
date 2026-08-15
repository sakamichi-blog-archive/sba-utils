/**
 * Throws `RangeError` at fetch time if `month` is given without `year`, or `day` without `month`. Omit all
 * of them to get the site's default listing: the most recent news, which spans several months rather than
 * the current one.
 */
export interface NewsFilter {
  /** Full year, e.g. `2026`. Required if `month` is given */
  year?: number
  /** 1-based (January = 1); requires `year`, required if `day` is given */
  month?: number
  /** Day of the month; requires `month`. Narrows the listing to that single day */
  day?: number
}

export interface News {
  /**
   * Stable category key as used by the site, e.g. `"media"`. Taken from the `category_xxx`/`cate-xxx` class
   * for `hinata`/`sakura` and from the API's `cate` field for `nogi`. Prefer this for storing and filtering:
   * unlike {@link News.categoryName} it does not change when a category is relabelled. Empty string when
   * the site does not give one.
   */
  categoryKey: string
  /**
   * Category label as shown on the site (Japanese), e.g. `"メディア"`. Read straight off the item, which
   * renders it — except for Nogi news, whose API returns the key alone and whose label is resolved against
   * the site's category nav. Empty string when no label could be read.
   */
  categoryName: string
  /**
   * Publication date at JST midnight. Only Nogi publishes a time of day, exposed as `datetime` on its own
   * news type.
   */
  date: Date
  /** Site-specific news identifier, unique per news */
  id: string
  title: string
  /** Absolute URL of the detail page */
  url: string
}

export interface NewsWithHtml extends News {
  /** Detail content HTML */
  html: string
}

export interface NewsDetail extends NewsWithHtml {
  /**
   * Member names associated with the news, with whitespace removed (e.g. `"金村美玖"`). Empty when none
   * are listed. Only `hinata` and `sakura` list members; `nogi` exposes none.
   */
  members: string[]
}

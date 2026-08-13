export type NewsGroup = "hinata" | "nogi" | "sakura"

/** Throws `RangeError` at fetch time if `month` is given without `year`. Omit both to get the current month. */
export interface NewsFilter {
  /** Full year, e.g. `2026`. Required if `month` is given */
  year?: number
  /** 1-based (January = 1); requires `year` */
  month?: number
}

export interface News {
  /**
   * Category label as shown on the site (Japanese), e.g. `"メディア"`. `undefined` when the news carries
   * no category. For `nogi` (whose API exposes only a category key), an unrecognized key is passed through
   * verbatim rather than mapped to a label.
   */
  category?: string
  /**
   * Publication date at JST midnight. `nogi` also exposes the time of day via {@link News.datetime}; the
   * other groups publish the date only.
   */
  date: Date
  /** Publication date and time (JST). Only `nogi` exposes a time of day */
  datetime?: Date
  group: NewsGroup
  /** Site-specific news identifier, unique per news */
  id: string
  title: string
  /** Absolute URL of the detail page */
  url: string
}

export interface NewsWithHtml extends News {
  /** Detail content HTML */
  html: string
  /**
   * Member names associated with the news, with whitespace removed (e.g. `"金村美玖"`). Empty when none
   * are listed.
   */
  members: string[]
}

export interface ScheduleFilter {
  /** Full year, e.g. `2026` */
  year: number
  /** 1-based (January = 1) */
  month: number
}

export interface ScheduleEvent {
  /**
   * Stable category key as used by the site, e.g. `"live"`. Taken from the `category_xxx`/`cate-xxx` class
   * for `hinata`/`sakura` and from the API's `cate` field for `nogi`. Prefer this for storing and
   * filtering: unlike {@link ScheduleEvent.categoryName} it does not change when a category is relabelled.
   * Empty string when the site does not give one.
   */
  categoryKey: string
  /**
   * Category label as shown on the site (Japanese), e.g. `"ライブ/イベント"`. Read straight off the event,
   * which renders it — except for Nogi events, whose API returns the key alone and whose label is resolved
   * against the site's category nav. Empty string when no label could be read.
   */
  categoryName: string
  /** Event date at JST midnight. Time of day, if any, is carried by {@link ScheduleEvent.timeStart} */
  date: Date
  /**
   * Site-specific event identifier. A recurring event keeps a single id across all of its occurrences, in
   * every group, so an id alone does not identify an entry in a month's listing.
   */
  id?: string
  /**
   * Member names associated with the event, with whitespace removed (e.g. `"五百城茉央"`). Empty when none
   * are listed.
   */
  members: string[]
  /** Start time in `HH:mm` (JST) */
  timeStart?: string
  /** End time in `HH:mm` (JST) */
  timeEnd?: string
  title: string
  /**
   * Absolute URL. Meaning differs per group:
   *
   * - `nogi`: always present; a recurring event's occurrences share an id but each carries its own URL,
   *   which pins the occurrence date in its query
   * - `hinata`: recurring events share the same URL
   * - `sakura`: `undefined` (the detail lives in an on-page modal with no standalone URL)
   */
  url?: string
}

export interface ScheduleEventWithHtml extends ScheduleEvent {
  /** Detail content HTML */
  html: string
}

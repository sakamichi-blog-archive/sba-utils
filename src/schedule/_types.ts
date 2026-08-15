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
   */
  categoryKey: string
  /**
   * Category label as shown on the site (Japanese), e.g. `"ライブ/イベント"`. Read straight off the event,
   * which renders it. Only {@link NogiScheduleEvent} can lack one — its API returns the key alone.
   */
  categoryName: string
  /** Event date at JST midnight. Time of day, if any, is carried by {@link ScheduleEvent.timeStart} */
  date: Date
  /**
   * Site-specific event identifier. Meaning differs per group:
   *
   * - `nogi`: unique per event
   * - `hinata`: recurring events share the same id
   * - `sakura`: recurring events share the same id
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
   * - `nogi`: unique per event
   * - `hinata`: recurring events share the same URL
   * - `sakura`: `undefined` (the detail lives in an on-page modal with no standalone URL)
   */
  url?: string
}

export interface ScheduleEventWithHtml extends ScheduleEvent {
  /** Detail content HTML */
  html: string
}

export type ScheduleGroup = "hinata" | "nogi" | "sakura"

export interface ScheduleFilter {
  /** Full year, e.g. `2026` */
  year: number
  /** 1-based (January = 1) */
  month: number
}

export interface ScheduleEvent {
  /**
   * Category label as shown on the site (Japanese), e.g. `"ライブ/イベント"`. `undefined` when the event
   * carries no category. For `nogi` (whose API exposes only a category key), an unrecognized key is passed
   * through verbatim rather than mapped to a label.
   */
  category?: string
  /** Event date at JST midnight. Time of day, if any, is carried by {@link ScheduleEvent.timeStart} */
  date: Date
  group: ScheduleGroup
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
   *
   * `hinata` list events omit this field entirely — use `fetchHinataScheduleEvent` for member details.
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

/** Throws `RangeError` at fetch time if `month`/`day`/`year` requirements below aren't met */
export interface BlogListFilter {
  /** Required if `month` or `day` is given */
  year?: number
  /** 1-based (January = 1); requires `year`, required if `day` is given */
  month?: number
  /** Requires `month` to also be given */
  day?: number
  /** 0-indexed */
  page?: number
}

export interface Blog {
  datetime: Date
  /** Potentially spaced */
  memberName: string
  title: string
  uid: number
  url: string
}

export interface BlogWithHtml extends Blog {
  html: string
  images: {
    /** Absolute URL of parent `<a>` element `href` attribute */
    anchorElementUrl?: string
    /** `<img>` element `src` attribute */
    src: string
    /** Absolute URL of `<img>` element `src` attribute */
    srcUrl: string
  }[]
}

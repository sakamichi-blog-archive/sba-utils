export interface Generation {
  /** Internal identifier */
  key: string
  /** Name for display. For example, "1期生" or "けやき坂46 1期生" */
  name: string
  /** Sequence of generation within a group; lower numbers are earlier generations */
  seq: number
}

export interface Member {
  /** Birth date in `YYYY-MM-DD` format */
  birthdate?: string
  generation?: Generation
  /** Graduation datetime in ISO 8601 format. `undefined` if not graduated. */
  graduatedAt?: string
  name: string
  /** English representation of the member's name, in Western order (given name first). Opinionated. */
  nameEnglish?: string
  nameSpaced: string
  /** Member ID used by official website */
  uid: string
}

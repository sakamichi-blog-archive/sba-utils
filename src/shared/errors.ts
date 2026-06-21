export class FetchStatusError extends Error {
  readonly status: number
  readonly url: string

  constructor(status: number, url: string) {
    super(`Invalid status code ${status} - ${url}`)
    this.name = "FetchStatusError"
    this.status = status
    this.url = url
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ParseError"
  }
}

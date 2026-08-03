import { describe, expect, it } from "vitest"

import { parseJsonpArgumentJson } from "./jsonp"

describe("parseJsonpArgumentJson()", () => {
  it("extracts single argument from function call", () => {
    expect(parseJsonpArgumentJson('res({"key":"value"})', "res")).toEqual({ key: "value" })
  })

  it("returns undefined when function name does not match", () => {
    expect(parseJsonpArgumentJson('res({"key":"value"})', "other")).toBeUndefined()
  })

  it("returns undefined when argument is not valid JSON", () => {
    expect(parseJsonpArgumentJson("res(not json)", "res")).toBeUndefined()
  })
})

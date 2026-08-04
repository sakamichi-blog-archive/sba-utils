/** Escape a string for literal use inside a `RegExp` */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Parse JSON argument from JSONP callback string */
export function parseJsonpArgumentJson(js: string, functionName: string): unknown {
  const match = js
    .trim()
    .match(new RegExp(`^${escapeRegExp(functionName)}\\s*\\(([\\s\\S]+)\\);?\\s*$`))
  if (match === null) return undefined

  try {
    return JSON.parse(match[1]!)
  } catch {
    return undefined
  }
}

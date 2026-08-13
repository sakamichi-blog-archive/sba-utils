/**
 * Resolve a category label from an element's `class` attribute by matching a whole
 * `${prefix}${key}` token (e.g. `category_media`, `cate-event`) against `categories`.
 */
export function resolveCategoryFromClass(
  classAttr: string,
  prefix: string,
  categories: Record<string, string>
): string | undefined {
  const tokens = classAttr.split(/\s+/)
  for (const key in categories) {
    if (tokens.includes(`${prefix}${key}`)) return categories[key]
  }
  return undefined
}

/**
 * Extract a category key from an element's `class` attribute by taking the first whole `${prefix}${key}`
 * token (e.g. `category_media` with prefix `category_` gives `media`). Unlike
 * {@link resolveCategoryFromClass}, the key need not be one you already know, so a category the site adds
 * later still comes through.
 */
export function getCategoryKeyFromClass(classAttr: string, prefix: string): string | undefined {
  for (const token of classAttr.split(/\s+/)) {
    if (token.startsWith(prefix) && token.length > prefix.length) {
      return token.slice(prefix.length)
    }
  }
  return undefined
}

/**
 * Resolve a category label from an element's `class` attribute by matching a whole
 * `${prefix}${key}` token (e.g. `category_media`, `cate-event`) against `categories`. Only keys present in
 * `categories` match, so an unrecognized one yields `undefined` rather than a key.
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

/**
 * Extract a category key from an element's `class` attribute by taking the first whole `${prefix}${key}`
 * token (e.g. `category_media` with prefix `category_` gives `media`). The key need not be one you already
 * know, so a category the site adds later still comes through.
 */
export function getCategoryKeyFromClass(classAttr: string, prefix: string): string | undefined {
  for (const token of classAttr.split(/\s+/)) {
    if (token.startsWith(prefix) && token.length > prefix.length) {
      return token.slice(prefix.length)
    }
  }
  return undefined
}

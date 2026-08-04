/**
 * Convert full-width numbers to half-width
 * @see {@link https://www.yoheim.net/blog.php?q=20191101}
 */
export function normalizeFullWidthNumbers(text: string): string {
  return text.replace(/[０-９]/g, str => String.fromCharCode(str.charCodeAt(0) - 0xfee0))
}

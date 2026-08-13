export type { News, NewsDetail, NewsFilter, NewsGroup, NewsWithHtml } from "./_types"
export {
  fetchHinataNews,
  fetchHinataNewsDetail,
  fetchHinataNewsDetailHtml,
  fetchHinataNewsHtml,
  getHinataNewsDetailUrl,
  getHinataNewsUrl,
  parseHinataNewsCategoriesHtml,
  parseHinataNewsDetailHtml,
  parseHinataNewsHtml
} from "./hinata"
export {
  fetchNogiNews,
  fetchNogiNewsCategories,
  fetchNogiNewsJs,
  getNogiNewsDetailUrl,
  getNogiNewsUrl,
  type NogiNews,
  parseNogiNewsCategoriesHtml,
  parseNogiNewsJs
} from "./nogi"
export {
  fetchSakuraNews,
  fetchSakuraNewsDetail,
  fetchSakuraNewsDetailHtml,
  fetchSakuraNewsHtml,
  getSakuraNewsDetailUrl,
  getSakuraNewsUrl,
  parseSakuraNewsCategoriesHtml,
  parseSakuraNewsDetailHtml,
  parseSakuraNewsHtml
} from "./sakura"

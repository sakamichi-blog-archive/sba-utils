export type { News, NewsDetail, NewsFilter, NewsGroup, NewsWithHtml } from "./_types"
export {
  fetchHinataNews,
  fetchHinataNewsDetail,
  fetchHinataNewsDetailHtml,
  fetchHinataNewsHtml,
  getHinataNewsDetailUrl,
  getHinataNewsUrl,
  parseHinataNewsDetailHtml,
  parseHinataNewsHtml
} from "./hinata"
export {
  fetchNogiNews,
  fetchNogiNewsJs,
  getNogiNewsDetailUrl,
  getNogiNewsUrl,
  type NogiNews,
  parseNogiNewsJs
} from "./nogi"
export {
  fetchSakuraNews,
  fetchSakuraNewsDetail,
  fetchSakuraNewsDetailHtml,
  fetchSakuraNewsHtml,
  getSakuraNewsDetailUrl,
  getSakuraNewsUrl,
  parseSakuraNewsDetailHtml,
  parseSakuraNewsHtml
} from "./sakura"

# SBA Utils

Utils written in JavaScript.

## Requirements

This package is ESM-only and requires Node.js `^22.12.0 || ^24.0.0`.

## Installation

Install from npm. If using `npm`:

```sh
npm install @sakamichi-blog-archive/utils
```

## Usage

### Blogs

```typescript
import { fetchHinataBlogs } from "@sakamichi-blog-archive/utils/blogs"
```

Fetch blogs from a specific year, month, or day:

```typescript
import { fetchHinataBlogs } from "@sakamichi-blog-archive/utils/blogs"

const { blogs } = await fetchHinataBlogs({ year: 2026, month: 7, day: 1 })
```

Fetch blogs from a specific member, using their member ID from the official website:

```typescript
import { fetchHinataBlogs } from "@sakamichi-blog-archive/utils/blogs"

const { blogs } = await fetchHinataBlogs({ memberUid: "25" })
```

#### Available functions

| Group  | Single blog            | Blog list                   | Blog list by date                 |
| ------ | ---------------------- | --------------------------- | --------------------------------- |
| Hinata | `fetchHinataBlog(uid)` | `fetchHinataBlogs(filter?)` | — (built into `fetchHinataBlogs`) |
| Nogi   | `fetchNogiBlog(uid)`   | `fetchNogiBlogs(filter?)`   | `fetchNogiBlogsByDate(filter)`    |
| Sakura | `fetchSakuraBlog(uid)` | `fetchSakuraBlogs(filter?)` | — (built into `fetchSakuraBlogs`) |

`filter` consists of the following properties. They may be used simultaneously.

- `page`: 0-based index
- `memberUid`: Member ID used by official websites
- `year`/`month`/`day`: Setting `month` requires `year`, and setting `day` requires `month`

Some functions do not accept some of the properties, due to the external API.

### News

```typescript
import { fetchHinataNews, fetchHinataNewsDetail } from "@sakamichi-blog-archive/utils/news"

// Fetch news from a specific year and month
const { news } = await fetchHinataNews({ year: 2026, month: 6 })

// Narrow it to a single day with `day`
const { news: onOneDay } = await fetchHinataNews({ year: 2026, month: 6, day: 30 })

// Omit the filter to fetch the most recent news
const { news: latest } = await fetchHinataNews()

// Fetch a single news by ID
const { newsDetail } = await fetchHinataNewsDetail("M02770")
```

#### Available functions

| Group  | News list                  | Single news                 |
| ------ | -------------------------- | --------------------------- |
| Hinata | `fetchHinataNews(filter?)` | `fetchHinataNewsDetail(id)` |
| Nogi   | `fetchNogiNews(filter?)`   | `fetchNogiNewsDetail(id)`   |
| Sakura | `fetchSakuraNews(filter?)` | `fetchSakuraNewsDetail(id)` |

`filter` accepts `year`, `month` (January = 1), and `day`. Setting `month` requires `year`, and setting `day` requires `month`. A filtered listing covers exactly that month or day, so there is no page size or offset to control.

Omitting `filter` does not fetch the current month — it returns the sites' default listing of most recent news, currently the latest 200 items, which spans several months.

Every news item exposes `date` (JST midnight), `categoryKey`/`categoryName`, `id`, `title`, and an absolute `url`. The remaining fields vary by group:

- **Nogi** news also include `datetime` (the API is the only one that exposes a time of day; absent on the rare item whose timestamp cannot be read) and the detail `html`, so the list alone is usually enough. They carry no member names, and `fetchNogiNewsDetail(id)` returns no `datetime` — the detail page shows a date only.
- **Hinata** and **Sakura** list news omit `html` and `members` — fetch a single news to get those.

`fetch*NewsDetail(id)` reaches a news of any age without knowing which month it falls in. The `id` comes from each list item.

News is returned oldest first, reversing the order shown on the sites.

#### Categories

Every news carries `categoryKey` and `categoryName`:

- `categoryKey` — the site's own key, for example `"media"`. Stable across relabelling, so prefer it for storing and grouping. It is not always the value the site filters on — Hinata tags fan club news `fanclubonly` but filters them with `cd=fanclub`.
- `categoryName` — the Japanese label shown on the site, for example `"メディア"`, read straight off the item.

`fetchNogiNews()` makes an extra request to resolve category names. To reuse one map across several Nogi calls instead of refetching it, run `fetchNogiNewsCategories()`, `fetchNogiNewsJs()`, and `parseNogiNewsJs()` directly:

```typescript
import {
  fetchNogiNewsCategories,
  fetchNogiNewsJs,
  parseNogiNewsJs
} from "@sakamichi-blog-archive/utils/news"

const categories = await fetchNogiNewsCategories()
const { js } = await fetchNogiNewsJs({ year: 2026, month: 6 })
const news = parseNogiNewsJs(js, categories) // reuse `categories` across calls
```

### Schedule

```typescript
import { fetchHinataScheduleEvents } from "@sakamichi-blog-archive/utils/schedule"
```

Fetch schedule events for a specific year and month:

```typescript
import { fetchHinataScheduleEvents } from "@sakamichi-blog-archive/utils/schedule"

const { events } = await fetchHinataScheduleEvents({ year: 2026, month: 8 })
```

#### Available functions

| Group  | Event list                          | Single event                               |
| ------ | ----------------------------------- | ------------------------------------------ |
| Hinata | `fetchHinataScheduleEvents(filter)` | `fetchHinataScheduleEvent(id)`             |
| Nogi   | `fetchNogiScheduleEvents(filter)`   | — (built into `fetchNogiScheduleEvents`)   |
| Sakura | `fetchSakuraScheduleEvents(filter)` | — (built into `fetchSakuraScheduleEvents`) |

`filter` requires both `year` and `month` (1-based; January = 1).

Every event exposes `date` (JST midnight), optional `timeStart`/`timeEnd` (`HH:mm`, JST), `categoryKey`/`categoryName`, and `title`. Categories work exactly as they do for news, including the extra request Nogi needs — see [Categories](#categories) above. The remaining fields vary by group:

- **Nogi** events also include `members`, the detail `html`, and a unique `url`.
- **Sakura** events also include `members` and the detail `html`, but no `url` (the detail is an on-page modal).
- **Hinata** list events include a `url` but omit `members` and `html` — fetch a single event with `fetchHinataScheduleEvent(id)` to get those. The `id` comes from each list event.

### Members

```typescript
import { hinataMembers } from "@sakamichi-blog-archive/utils/members"
```

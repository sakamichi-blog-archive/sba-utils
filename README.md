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

// Fetch blogs from a specific year, month, or day
const { blogs } = await fetchHinataBlogs({ year: 2026, month: 7, day: 1 })

// Fetch blogs from a specific member, using their member ID from the official website
const { blogs } = await fetchHinataBlogs({ memberUid: "25" })
```

#### Available functions

| Group  | Single blog            | Blog list                   | Blog list by date                 |
| ------ | ---------------------- | --------------------------- | --------------------------------- |
| Nogi   | `fetchNogiBlog(uid)`   | `fetchNogiBlogs(filter?)`   | `fetchNogiBlogsByDate(filter)`    |
| Hinata | `fetchHinataBlog(uid)` | `fetchHinataBlogs(filter?)` | — (built into `fetchHinataBlogs`) |
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

// Page through anything wider than a month; `page` is 0-indexed
const { news: page2 } = await fetchHinataNews({ year: 2025, page: 2 })

// Fetch a single news by ID
const { newsDetail } = await fetchHinataNewsDetail("M02770")
```

#### Available functions

| Group  | News list                  | Single news                 |
| ------ | -------------------------- | --------------------------- |
| Nogi   | `fetchNogiNews(filter?)`   | `fetchNogiNewsDetail(id)`   |
| Hinata | `fetchHinataNews(filter?)` | `fetchHinataNewsDetail(id)` |
| Sakura | `fetchSakuraNews(filter?)` | `fetchSakuraNewsDetail(id)` |

`filter` accepts `year`, `month` (January = 1), `day`, and `page`. Setting `month` requires `year`, and setting `day` requires `month`.

Every group serves news 200 at a time and truncates silently at that, so anything wider than a month needs `page` (0-indexed) to reach the rest — a year returns only its most recent 200 news on page 0.

Omitting `filter` returns the sites' most recent news, currently the latest 200 items, spanning several months.

Every news item exposes `date` (JST midnight), `categoryKey`/`categoryName`, `id`, `title`, and an absolute `url`. The remaining fields vary by group:

- **Nogi** news also include `datetime` (the API is the only one that exposes a time of day; absent on the rare item whose timestamp cannot be read) and the detail `html`, so the list alone is usually enough. They carry no member names, and `fetchNogiNewsDetail(id)` returns no `datetime` — the detail page shows a date only.
- **Hinata** and **Sakura** list news omit `html` and `members` — fetch a single news to get those.

Nogi list `html` comes from the API verbatim, so it keeps the source's entities and self-closing tags (`&ldquo;`, `<br />`), while every other `html` in this package is normalised by the parser (`“`, `<br>`).

News is returned oldest first, reversing the order shown on the sites.

`id` in `fetch*NewsDetail(id)` comes from each list item.

#### Categories

Every news carries `categoryKey` and `categoryName`:

- `categoryKey` — the site's own key, for example `"media"`. Stable across relabelling, so prefer it for storing and grouping.
- `categoryName` — the Japanese label shown on the site, for example `"メディア"`, read straight off the item.

`fetchNogiNews()` and `fetchNogiScheduleEvents()` each make an extra request to resolve category names. To reuse one map across several calls instead of refetching it, run the pieces directly:

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

```typescript
import {
  fetchNogiScheduleCategories,
  fetchNogiScheduleEventsJs,
  parseNogiScheduleEventsJs
} from "@sakamichi-blog-archive/utils/schedule"

const categories = await fetchNogiScheduleCategories()
const { js } = await fetchNogiScheduleEventsJs({ year: 2026, month: 8 })
const events = parseNogiScheduleEventsJs(js, categories) // reuse `categories` across calls
```

### Schedule

```typescript
import { fetchHinataScheduleEvents } from "@sakamichi-blog-archive/utils/schedule"

const { events } = await fetchHinataScheduleEvents({ year: 2026, month: 8 })
```

#### Available functions

| Group  | Event list                          | Single event                               |
| ------ | ----------------------------------- | ------------------------------------------ |
| Nogi   | `fetchNogiScheduleEvents(filter)`   | `fetchNogiScheduleEvent(id, occurrence?)`  |
| Hinata | `fetchHinataScheduleEvents(filter)` | `fetchHinataScheduleEvent(id)`             |
| Sakura | `fetchSakuraScheduleEvents(filter)` | — (built into `fetchSakuraScheduleEvents`) |

`filter` requires both `year` and `month` (January = 1).

Every event exposes `date` (JST midnight), optional `timeStart`/`timeEnd` (`HH:mm`, JST), `categoryKey`/`categoryName`, and `title`. Categories work exactly as news, including the extra request Nogi needs — see [Categories](#categories) above. The remaining fields vary by group:

- **Nogi** list events include `members`, the detail `html`, and a `url`. Single event does not return `members`.
- **Hinata** list events include a `url`. `members` and `html` are not included — fetch single event to get those. The `id` comes from each list event.
- **Sakura** list events include `members` and the detail `html`, but no `url` (the detail is an on-page modal).

An `id` identifies an event, not one occurrence of it: in every group a recurring event keeps one `id` (and one `url`) across every occurrence, so an `id` is not a key for a row in a month's listing.

So pass the occurrence you want to `fetchNogiScheduleEvent(id, occurrence)`:

```typescript
import {
  fetchNogiScheduleEvent,
  fetchNogiScheduleEvents
} from "@sakamichi-blog-archive/utils/schedule"

const { events } = await fetchNogiScheduleEvents({ year: 2026, month: 8 })
const { event } = await fetchNogiScheduleEvent(events[0].id, events[0].date)
```

Without `occurrence` the page reports the date the event was **first listed**, so a weekly show appearing under 2026/08/01 reports its first airing back in April, and a birthday reports the year its entry was created rather than the member's year of birth. The site does not check the date against the event, so one the event does not fall on is displayed just the same.

### Members

```typescript
import { hinataMembers } from "@sakamichi-blog-archive/utils/members"
```

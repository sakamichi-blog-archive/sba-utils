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
import { fetchHinataNews } from "@sakamichi-blog-archive/utils/news"
```

Fetch news from a specific year and month:

```typescript
import { fetchHinataNews } from "@sakamichi-blog-archive/utils/news"

const { news } = await fetchHinataNews({ year: 2026, month: 6 })
```

Narrow it to a single day with `day`:

```typescript
import { fetchHinataNews } from "@sakamichi-blog-archive/utils/news"

const { news } = await fetchHinataNews({ year: 2026, month: 6, day: 30 })
```

Omit the filter to fetch the most recent news:

```typescript
import { fetchHinataNews } from "@sakamichi-blog-archive/utils/news"

const { news } = await fetchHinataNews()
```

#### Available functions

| Group  | News list                  | Single news                 |
| ------ | -------------------------- | --------------------------- |
| Hinata | `fetchHinataNews(filter?)` | `fetchHinataNewsDetail(id)` |
| Nogi   | `fetchNogiNews(filter?)`   | `fetchNogiNewsDetail(id)`   |
| Sakura | `fetchSakuraNews(filter?)` | `fetchSakuraNewsDetail(id)` |

`filter` accepts `year`, `month` (1-based; January = 1), and `day`. Setting `month` requires `year`, and setting `day` requires `month`. A filtered listing covers exactly that month or day, so there is no page size or offset to control.

Omitting `filter` does not fetch the current month — it returns the sites' default listing of most recent news, currently the latest 200 items, which spans several months. Pass `year`/`month` when you need a specific month.

Every news item exposes `date` (JST midnight), `categoryKey`/`categoryName`, `id`, `title`, and an absolute `url`. The remaining fields vary by group:

- **Nogi** news also include `datetime` (the API is the only one that exposes a time of day) and the detail `html`, so the list alone is usually enough. They carry no member names, and `fetchNogiNewsDetail(id)` returns no `datetime` — the detail page shows a date only.
- **Hinata** and **Sakura** list news omit `html` and `members` — fetch a single news to get those.

`fetch*NewsDetail(id)` reaches a news of any age without knowing which month it falls in. The `id` comes from each list item.

News is returned oldest first, reversing the order shown on the sites.

#### Categories

Every news carries `categoryKey` and `categoryName`:

- `categoryKey` — the site's own key, e.g. `"media"`. Stable across relabelling, so prefer it for storing and filtering.
- `categoryName` — the Japanese label shown on the site, e.g. `"メディア"`, read straight off the item.

Both are always present, with one exception: Nogi's listing API returns the key alone, so `NogiNews.categoryName` is optional — a key too new to appear in the site's category nav resolves to no label. `fetchNogiNewsDetail` has no such gap, since the detail page renders the label.

The split matters because labels move: `shakehands` was 握手会 and is now ミート＆グリート, while the key stayed put.

Labels are read from each site's own category nav at runtime, so a category added or renamed upstream is picked up without a release; a small built-in map is kept only as a fallback.

For Hinata and Sakura the nav ships in the same document as the news itself, so this costs nothing. Nogi's API returns category keys only, so `fetchNogiNews` fetches the listing page alongside it — two requests per call. If that request fails it falls back to the built-in map rather than failing the fetch, and a key present in neither is passed through verbatim.

To resolve labels yourself, or to avoid the second Nogi request, use the map directly:

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

Every event exposes `date` (JST midnight), optional `timeStart`/`timeEnd` (`HH:mm`, JST), `category`, and `title`. The remaining fields vary by group:

- **Nogi** events also include `members`, the detail `html`, and a unique `url`.
- **Sakura** events also include `members` and the detail `html`, but no `url` (the detail is an on-page modal).
- **Hinata** list events include a `url` but omit `members` and `html` — fetch a single event with `fetchHinataScheduleEvent(id)` to get those. The `id` comes from each list event.

### Members

```typescript
import { hinataMembers } from "@sakamichi-blog-archive/utils/members"
```

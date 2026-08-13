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

Omit the filter to fetch the current month:

```typescript
import { fetchHinataNews } from "@sakamichi-blog-archive/utils/news"

const { news } = await fetchHinataNews()
```

#### Available functions

| Group  | News list                  | Single news                    |
| ------ | -------------------------- | ------------------------------ |
| Hinata | `fetchHinataNews(filter?)` | `fetchHinataNewsDetail(id)`    |
| Nogi   | `fetchNogiNews(filter?)`   | — (built into `fetchNogiNews`) |
| Sakura | `fetchSakuraNews(filter?)` | `fetchSakuraNewsDetail(id)`    |

`filter` accepts `year` and `month` (1-based; January = 1). Setting `month` requires `year`. Omit both for the current month — the site's own listing pages cover one month at a time, so there is no page size or offset to control.

Every news item exposes `date` (JST midnight), `category`, `id`, `title`, and an absolute `url`. The remaining fields vary by group:

- **Nogi** news also include `datetime` (the API is the only one that exposes a time of day) and the detail `html`, so no second request is needed. They carry no member names.
- **Hinata** and **Sakura** list news omit `html` and `members` — fetch a single news with `fetchHinataNewsDetail(id)` / `fetchSakuraNewsDetail(id)` to get those. The `id` comes from each list item.

News is returned oldest first, reversing the order shown on the sites.

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

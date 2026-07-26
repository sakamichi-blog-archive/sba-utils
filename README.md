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

#### Available functions

| Group  | Single blog            | Blog list                   | Blog list by date                 |
| ------ | ---------------------- | --------------------------- | --------------------------------- |
| Hinata | `fetchHinataBlog(uid)` | `fetchHinataBlogs(filter?)` | — (built into `fetchHinataBlogs`) |
| Nogi   | `fetchNogiBlog(uid)`   | `fetchNogiBlogs(page?)`     | `fetchNogiBlogsByDate(filter)`    |
| Sakura | `fetchSakuraBlog(uid)` | `fetchSakuraBlogs(filter?)` | — (built into `fetchSakuraBlogs`) |

`filter` is a `BlogListFilter` (`{ year?, month?, day?, page? }`); `page` is 0-indexed. Hinata and
Sakura take it directly on their list function; Nogi's default `fetchNogiBlogs()` hits a JSON API
with no date filter, so it only takes a 0-indexed `page` number (32 blogs per page), while filtering
by date uses the separate `fetchNogiBlogsByDate(filter)`, which requires `year` and returns a
lighter `NogiBlogSummary` (no `memberName`).

### Members

```typescript
import { hinataMembers } from "@sakamichi-blog-archive/utils/members"
```

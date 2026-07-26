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

`filter` is a `BlogListFilter` (`{ year?, month?, day?, page?, memberUid? }`); `page` is 0-indexed
and `memberUid` is the member ID used by the official website.

- Hinata and Sakura take `filter` directly on their list function.
- Nogi's default `fetchNogiBlogs()` doesn't support date filtering, so it instead takes a
  `NogiBlogsFilter` (`{ page?, memberUid? }`, no date fields).
- Filtering Nogi blogs by date uses the separate `fetchNogiBlogsByDate(filter)`, which requires
  `year` and returns a lighter `NogiBlogSummary` (no `memberName`).

### Members

```typescript
import { hinataMembers } from "@sakamichi-blog-archive/utils/members"
```

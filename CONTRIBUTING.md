# CONTRIBUTING

## Git

### Workflow

- Feature branches: `features/<name>`
- Merge PRs using squash merge. The PR title becomes the commit on `main` and the changelog entry, so it must follow Conventional Commits format.

### Making commits

Commits must be made in logical units, and in a logical timeline.
Do not bundle unrelated changes into a single commit.

### Commit messages

- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with types from [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional), plus `deps` for dependency updates.
- Description after the colon should be capitalized, unless it begins with a proper noun

### Commit message syntax

Scopes are wrapped in parentheses.

- No scope or breaking changes: `<type>: <description>`
- No scope with breaking changes: `<type>!: <description>`
- With scope, no breaking changes: `<type>(<scope>): <description>`
- With scope with breaking changes: `<type>(<scope>)!: <description>`

### Breaking changes

A commit that breaks the public API needs `!` in its type _and_ a `BREAKING CHANGE:` footer — its own paragraph at the end of the body, before any `Co-Authored-By`:

```
feat!: Make nameEnglish and nameKana optional

<why>

BREAKING CHANGE: `Member.nameEnglish` and `Member.nameKana` are now optional.
```

The footer is what Release Please renders under ⚠ BREAKING CHANGES, so write it for a consumer: what changed, and what they have to do. It reaches Release Please because GitHub composes the squash commit body from these messages — the individual commits are otherwise invisible after a squash merge.

The PR title needs the `!` as well. It becomes the squash commit's subject, and without it there is no breaking-changes section at all, however the body reads.

### Commit message scopes

- `claude`: `.claude/` and `CLAUDE.md` changes
- `github`: `.github/` changes
- No scope: Changes that don't match any of the above

If a commit includes multiple scopes (including no scope), omit the scope.

---

## Releases

Releases are managed by [Release Please](https://github.com/googleapis/release-please) and published to npm via [Trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC — no token required).

### Flow

1. Merge feature/fix PRs to `main` as usual
2. Release Please opens (or updates) a Release PR that bumps the version in `package.json` and updates `CHANGELOG.md` based on Conventional Commits
3. When you're ready to release, optionally edit `CHANGELOG.md` in the Release PR to override the generated release notes, then merge
4. The package is automatically published to npm

### Versioning

While the package is pre-1.0, `bump-minor-pre-major: true` is set in `release-please-config.json` so that breaking changes bump the minor version instead of the major. Remove this when releasing 1.0.0.

---

## Coding conventions

### Comparisons

Use explicit comparisons for non-boolean types. For booleans, use the value directly:

```ts
// prefer
if (value === 0) ...
if (value !== undefined) ...
if (value === "") ...
if (value === null) ...
if (Number.isNaN(value)) ...
if (isReady) ...
if (!isReady) ...

// avoid
if (!value) ...        // when value is a number, string, or object
if (value) ...         // when value is a number, string, or object
```

### Guard clauses

Add a blank line after a guard clause:

```ts
// prefer — one-liner
if (uid === undefined) throw new ParseError("...")

doSomething()

// prefer — multiline
if (uid === undefined) {
  throw new ParseError("...")
}

doSomething()

// avoid
if (uid === undefined) throw new ParseError("...")
doSomething()
```

---

## Member data

`src/members/*.ts` is maintained by hand, but `nameEnglish` and `nameKana` are sourced from the official websites wherever the member is still listed there. Both are optional: the non-member blog accounts have no source for either.

### Where each field comes from

| Group  | Source                                                                  | `nameEnglish`  | `nameKana`           |
| ------ | ----------------------------------------------------------------------- | -------------- | -------------------- |
| Nogi   | `https://www.nogizaka46.com/s/n46/api/list/member?callback=res` (JSONP) | `english_name` | `kana`               |
| Hinata | `https://www.hinatazaka46.com/s/official/artist/<uid>?ima=0000`         | `span.name_en` | `div.c-member__kana` |
| Sakura | `https://sakurazaka46.com/s/s46/artist/<uid>?ima=0000`                  | `p.eigo`       | `p.kana`             |
| Keyaki | `https://www.keyakizaka46.com/s/k46o/artist/<uid>?ima=0000`             | `span.en`      | `p.furigana`         |

Nogi's endpoint includes graduated members.

The other three site-scraped groups serve a 404 for members who have left, which is the only gap in coverage. Keyaki is doubly affected: its site lists only the members who stayed through the Sakurazaka rename, and everyone who moved to Hinatazaka redirects to the Hinatazaka site instead.

### Normalization

The sites disagree on presentation, so only the spelling is taken from them, not the casing or the name order:

- `nameEnglish`: Title Case, Western order (given name first) — Nogi serves lowercase and the others uppercase, and Nogi's own data mixes both name orders
- `nameKana`: hiragana, family name first, one space between the two parts

### Values with no source

Members whose pages are gone keep whatever this repository already had. A member's `nameEnglish` already encodes the reading, so a hand-written `nameKana` should agree with it.

The non-member blog accounts (`運営スタッフ`, the generation relay accounts) are on no site's member list at all — the blog APIs give them a Japanese `name` and nothing else — so both properties are left `undefined` rather than invented. `ポカ` is the exception: its reading is unambiguous, so it keeps `Poka` and `ぽか`.

---

## Testing

### Fixtures

Fixtures live in `src/test/fixtures/` and are loaded via `readFixture()` in tests.

**Content**

- HTML/JS structure must be minimal but realistic — just enough to satisfy the CSS selectors used by each parser
- Titles are fine to keep real; body text should not contain real post content
- Include ≥2 entries per list fixture to cover ordering and field variation
- Cover meaningful variation: empty titles, single-digit vs. zero-padded dates, different image counts

**URLs**

- Blog page URLs (e.g. `nogizaka46.com/s/n46/diary/detail/...`) are public — keep them real
- Image `src` attributes must match the format used by the real site, but with dummy filenames:
  - Hinata: absolute URL — `https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/YYYYMM/mobXXXXX.jpg`
  - Nogi: absolute path — `/files/46/diary/n46/MEMBER/moblog/YYYYMM/mobXXXXX.jpg`
  - Sakura: absolute path — `/files/14/diary/s46/blog/moblog/YYYYMM/mobXXXXX.jpg`

**Updating snapshots**

When fixture or parser changes cause inline snapshots to go stale, update them with:

```sh
pnpm run test:update
```

Review the diff before committing — snapshot updates are the test's way of showing you what changed in the output.

**Formatting**

- `.jsonp` extension for JSONP fixtures so oxfmt skips them
- Use `<!-- prettier-ignore -->` inline to preserve intentional whitespace in HTML fixtures (oxfmt's HTML formatter only recognises `prettier-ignore`)

---

## mise

### Tools

Run `mise use <tool>` to add a tool, then run `mise lock` to update `mise.lock`.
Do not use `--global, -g`.

### Settings

- Set/Modify setting: `mise settings set --local <key> <value>`
- Unset setting: `mise settings unset --local <key>`

Always modify local config by adding `--local`; do not modify global config.

### Tasks

- Tasks must be ordered alphabetically
- Tasks for root should not have a prefix

---

## pnpm

pnpm is installed by mise, because Node.js 26 — the development runtime — no longer bundles Corepack.

### Updating pnpm version

The version must be kept in sync in two places: the `pnpm` tool in `mise.toml` (used locally) and the `devEngines.packageManager` field in `package.json` (used by `pnpm/setup` in CI).

```sh
mise use pnpm@latest
mise lock
```

Then set the same version in `devEngines.packageManager` in `package.json` and run
`pnpm install` — pnpm records its own resolved version under
`packageManagerDependencies` in `pnpm-lock.yaml`.

---

## Claude Code

### Settings

Edit project-level settings file (`.claude/settings.json`) by default.
Only edit user-level settings (`~/.claude/settings.json`) if explicitly asked.

When working in a worktree, edit the project-level settings inside the worktree, not in the main repository.

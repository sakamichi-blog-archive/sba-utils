# CONTRIBUTING

## Git

### Workflow

- Feature branches: `features/<name>`
- Merge branches using a merge commit (`git merge --no-ff`). Use git's default merge commit message.

### Making commits

Commits must be made in logical units, and in a logical timeline.
Do not bundle unrelated changes into a single commit.

### Commit messages

- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- Common types: `feat`, `fix`, `docs`, `refactor`, `chore`, `ci`, `test`, `style`
- Description after the colon should be capitalized, unless it begins with a proper noun

### Commit message syntax

Scopes are wrapped in parentheses.

- No scope or breaking changes: `<type>: <description>`
- No scope with breaking changes: `<type>!: <description>`
- With scope, no breaking changes: `<type>(<scope>): <description>`
- With scope with breaking changes: `<type>(<scope>)!: <description>`

### Commit message scopes

- `claude`: `.claude/` and `CLAUDE.md` changes
- `github`: `.github/` changes
- No scope: Changes that don't match any of the above

If a commit includes multiple scopes (including no scope), omit the scope.

---

## Releases

Releases are managed by [Release Please](https://github.com/googleapis/release-please). It watches commits on `main` and maintains a Release PR that bumps the version in `package.json` and updates `CHANGELOG.md` based on Conventional Commits.

Merging that Release PR publishes the package to npm via [npm provenance](https://docs.npmjs.com/generating-provenance-statements) (OIDC — no token required).

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

## Claude Code

### Settings

Edit project-level settings file (`.claude/settings.json`) by default.
Only edit user-level settings (`~/.claude/settings.json`) if explicitly asked.

When working in a worktree, edit the project-level settings inside the worktree, not in the main repository.

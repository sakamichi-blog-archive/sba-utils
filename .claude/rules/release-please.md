---
paths:
  - release-please-config.json
---

The `changelog-sections` entry for `deps` exists so that Dependabot npm bumps trigger patch release PRs instead of being silently skipped.

Two separate mechanisms in release-please combine to produce this:

1. `src/versioning-strategies/default.ts` — version bump logic only checks for `feat`/breaking changes; everything else falls through to a patch bump.
2. `src/strategies/base.ts` — `buildReleasePullRequest` has a `changelogEmpty` gate: if the rendered changelog body is empty, the release PR is suppressed entirely.

So `deps:` commits with no `changelog-sections` entry → empty changelog → release PR suppressed. Adding `deps` to `changelog-sections` (hidden: false by default) → commit appears in changelog → gate passes → patch release PR is created.

`changelog-sections` has no `bump` property; the patch bump comes purely from the fallthrough in the versioning strategy.

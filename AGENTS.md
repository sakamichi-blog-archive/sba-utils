# AGENTS.md

Read [README](./README.md) and [CONTRIBUTING](./CONTRIBUTING.md) first.

This document's purpose is to provide coding agent specific instructions.

## Before committing

Always run checks before committing:

- `pnpm run check` — format, lint, typecheck, tests, build, and pack check
- `mise run check:workflows` — lint GitHub Actions workflows with actionlint and zizmor

When modifying workflow files (`.github/workflows/`), run both. Otherwise `pnpm run check` is sufficient.

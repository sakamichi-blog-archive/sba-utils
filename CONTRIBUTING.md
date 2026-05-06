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

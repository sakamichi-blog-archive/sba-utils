import { defineConfig } from "oxfmt"

export default defineConfig({
  arrowParens: "avoid",
  ignorePatterns: ["CHANGELOG.md"],
  semi: false,
  sortImports: true,
  trailingComma: "none"
})

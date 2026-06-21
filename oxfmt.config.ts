import { defineConfig } from "oxfmt"

export default defineConfig({
  arrowParens: "avoid",
  // gitignored files are ignored by default
  ignorePatterns: [
    "*.toml" // Ignore because VS Code doesn't recognize TOML natively
  ],
  semi: false,
  sortImports: true,
  trailingComma: "none"
})

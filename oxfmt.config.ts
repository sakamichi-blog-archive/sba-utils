import { defineConfig } from "oxfmt"

export default defineConfig({
  arrowParens: "avoid",
  ignore: ["CHANGELOG.md"],
  semi: false,
  sortImports: true,
  trailingComma: "none"
})

import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "browser",
          environment: "happy-dom"
        }
      },
      {
        test: {
          name: "node",
          environment: "node"
        }
      }
    ]
  }
})

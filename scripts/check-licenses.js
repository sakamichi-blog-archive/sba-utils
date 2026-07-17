// Checks that all production dependencies use licenses compatible with MIT distribution.
import { execSync } from "node:child_process"

const ALLOWED = new Set([
  "MIT",
  "ISC",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "Apache-2.0",
  "0BSD",
  "BlueOak-1.0.0"
])

const json = execSync("pnpm licenses list --prod --json", { encoding: "utf8" })
const byLicense = JSON.parse(json)

const disallowed = Object.keys(byLicense).filter(license => !ALLOWED.has(license))

if (disallowed.length === 0) {
  console.log("All production dependency licenses are approved.")
  process.exit(0)
}

for (const license of disallowed) {
  for (const pkg of byLicense[license]) {
    console.error(`NOT APPROVED: ${pkg.name}@${pkg.versions[0]} (${license})`)
  }
}
process.exit(1)

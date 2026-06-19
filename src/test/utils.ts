import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const FIXTURES_DIR = resolve(import.meta.dirname, "fixtures")

export function readFixture(name: string): string {
  return readFileSync(resolve(FIXTURES_DIR, name), "utf-8")
}

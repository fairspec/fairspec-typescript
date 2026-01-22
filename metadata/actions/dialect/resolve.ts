import type { Dialect } from "../../models/dialect/dialect.ts"
import { loadDialect } from "./load.ts"

export async function resolveDialect(dialect?: Dialect | string) {
  if (!dialect) {
    return undefined
  }

  if (typeof dialect !== "string") {
    return dialect
  }

  return await loadDialect(dialect)
}

import type { FileDialect } from "../../models/fileDialect/fileDialect.ts"
import { loadFileDialect } from "./load.ts"

export async function resolveFileDialect(dialect?: FileDialect | string) {
  if (!dialect) {
    return undefined
  }

  if (typeof dialect !== "string") {
    return dialect
  }

  return await loadFileDialect(dialect)
}

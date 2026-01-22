import type { Dialect } from "../../models/dialect/dialect.ts"
import type { Resource } from "../../models/resource.ts"
import { inferDialectFormat } from "./infer.ts"
import { resolveDialect } from "./resolve.ts"

export async function getSupportedDialect(
  resource: Resource,
  formats: Dialect["format"][],
): Promise<Dialect | undefined> {
  const dialect = await resolveDialect(resource.dialect)

  if (dialect) {
    return formats.includes(dialect.format) ? dialect : undefined
  }

  const format = inferDialectFormat(resource)
  return formats.includes(format) ? { format } : undefined
}

import type { Dialect } from "../../models/dialect/dialect.ts"
import type { Resource } from "../../models/resource.ts"
import { inferDialectFormat } from "./infer.ts"
import { resolveDialect } from "./resolve.ts"

export async function getSupportedDialect<F extends Dialect["format"]>(
  resource: Resource,
  suportedFormats: F[],
): Promise<Extract<Dialect, { format: F }> | undefined> {
  const dialect = (await resolveDialect(resource.dialect)) ?? {
    format: inferDialectFormat(resource),
  }

  for (const supportedFormat of suportedFormats) {
    if (dialect.format === supportedFormat) {
      return dialect as Extract<Dialect, { format: F }>
    }
  }

  return undefined
}

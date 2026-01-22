import type { InferDialectOptions } from "@fairspec/dataset"
import type { Resource } from "@fairspec/metadata"
import { system } from "../../system.ts"

// TODO: review default values being {} vs undefined

export async function inferDialect(
  resource: Resource,
  options?: InferDialectOptions,
) {
  for (const plugin of system.plugins) {
    const dialect = await plugin.inferDialect?.(resource, options)
    if (dialect) {
      return dialect
    }
  }

  return undefined
}

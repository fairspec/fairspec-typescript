import type { Resource } from "@fairspec/metadata"
import type { InferSchemaOptions } from "@fairspec/table"
import { inferSchemaFromTable } from "@fairspec/table"
import { system } from "../system.ts"
import { loadTable } from "../table/index.ts"

export async function inferSchema(
  resource: Partial<Resource>,
  options?: InferSchemaOptions,
) {
  for (const plugin of system.plugins) {
    const schema = await plugin.inferSchema?.(resource, options)
    if (schema) {
      return schema
    }
  }

  const table = await loadTable(resource, { denormalized: true })
  if (!table) {
    return undefined
  }

  const schema = await inferSchemaFromTable(table, options)
  return schema
}

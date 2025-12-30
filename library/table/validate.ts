import type { Resource, UnboundError } from "@fairspec/metadata"
import { createReport, resolveSchema } from "@fairspec/metadata"
import type { LoadTableOptions } from "@fairspec/table"
import { inspectTable } from "@fairspec/table"
import { inferSchema } from "../schema/index.ts"
import { loadTable } from "./load.ts"

export async function validateTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions & { maxErrors?: number },
) {
  const { maxErrors } = options ?? {}

  const errors: UnboundError[] = []
  const table = await loadTable(resource, { denormalized: true })

  if (table) {
    let schema = await resolveSchema(resource.schema)
    if (!schema) schema = await inferSchema(resource, options)
    const tableErrors = await inspectTable(table, { schema, maxErrors })
    errors.push(...tableErrors)
  }

  // TODO: review
  if (!table && resource.schema) {
    errors.push({
      type: "data",
      message: `missing ${resource.name} table`,
    })
  }

  return createReport(errors, { maxErrors })
}

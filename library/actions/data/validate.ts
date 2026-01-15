import type { GeneralError, Resource } from "@fairspec/metadata"
import { createReport, resolveTableSchema } from "@fairspec/metadata"
import { inspectTable } from "@fairspec/table"
import { inferTableSchema } from "../../actions/tableSchema/infer.ts"
import { loadData } from "./load.ts"

export async function validateData(resource: Partial<Resource>) {
  const { maxErrors } = options ?? {}

  const errors: GeneralError[] = []
  const table = await loadTable(resource, { denormalized: true })

  if (table) {
    let tableSchema = await resolveTableSchema(resource.tableSchema)
    if (!tableSchema) tableSchema = await inferTableSchema(resource, options)
    const tableErrors = await inspectTable(table, { tableSchema, maxErrors })
    errors.push(...tableErrors)
  } else if (resource.tableSchema) {
  }

  if (!table && resource.tableSchema) {
    errors.push({
      type: "resource",
      expectedDataType: "table",
    })
  }

  return createReport(errors, { maxErrors })
}

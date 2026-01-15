import type { GeneralError, Resource } from "@fairspec/metadata"
import { createReport, resolveTableSchema } from "@fairspec/metadata"
import type { LoadTableOptions } from "@fairspec/table"
import { inspectTable } from "@fairspec/table"
import { inferTableSchema } from "../../actions/tableSchema/infer.ts"
import { loadTable } from "./load.ts"

export type ValidateTableOptions = LoadTableOptions & {
  noInfer?: boolean
  maxErrors?: number
}

export async function validateTable(
  resource: Partial<Resource>,
  options?: ValidateTableOptions,
) {
  const { maxErrors } = options ?? {}
  const errors: GeneralError[] = []

  let tableSchema = await resolveTableSchema(resource.tableSchema)
  if (!tableSchema && !options?.noInfer) {
    tableSchema = await inferTableSchema(resource, options)
  }

  if (!tableSchema) {
    const table = await loadTable(resource, { denormalized: true })

    if (table) {
      const tableErrors = await inspectTable(table, { tableSchema, maxErrors })
      errors.push(...tableErrors)
    }

    if (!table) {
      errors.push({
        type: "resource/type",
        expectedResourceType: "table",
      })
    }
  }

  return createReport(errors, { maxErrors })
}

import type {
  ArrayColumn,
  CellError,
  GeojsonColumn,
  ObjectColumn,
  TopojsonColumn,
} from "@fairspec/metadata"
import { inspectJsonValue } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { isObject } from "../../../helpers/general.ts"
import type { Table } from "../../../models/table.ts"

// TODO: Improve the implementation
// Make unblocking / handle large data / process in parallel / move processing to Rust?

export async function inspectJsonColumn(
  column: ArrayColumn | ObjectColumn | GeojsonColumn | TopojsonColumn,
  table: Table,
  options?: {
    formatJsonSchema?: Record<string, any>
  },
) {
  const errors: CellError[] = []

  const formatJsonSchema = options?.formatJsonSchema
  const constraintJsonSchema = column.property

  const frame = await table
    .withRowCount()
    .select(
      pl.pl.col("row_nr").add(1).alias("number"),
      pl.pl.col(column.name).alias("source"),
    )
    .collect()

  for (const row of frame.toRecords() as any[]) {
    if (row.source === null) continue

    let target: Record<string, any> | undefined
    const checkCompat = column.type === "array" ? Array.isArray : isObject

    try {
      target = JSON.parse(row.source)
    } catch {}

    if (!target || !checkCompat(target)) {
      errors.push({
        type: "cell/type",
        cell: String(row.source),
        columnName: column.name,
        columnType: column.type,
        rowNumber: row.number,
      })

      continue
    }

    if (formatJsonSchema) {
      const formatErrors = await inspectJsonValue(target, {
        jsonSchema: formatJsonSchema,
      })

      if (formatErrors.length) {
        errors.push({
          type: "cell/type",
          cell: String(row.source),
          columnName: column.name,
          columnType: column.type,
          rowNumber: row.number,
        })
      }

      continue
    }

    if (constraintJsonSchema) {
      const constraintErrors = await inspectJsonValue(target, {
        jsonSchema: constraintJsonSchema,
      })

      for (const error of constraintErrors) {
        errors.push({
          type: "cell/json",
          cell: String(row.source),
          columnName: column.name,
          rowNumber: row.number,
          message: error.message,
          jsonPointer: error.jsonPointer,
        })
      }
    }
  }

  return errors
}

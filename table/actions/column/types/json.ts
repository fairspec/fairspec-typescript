import type {
  ArrayColumn,
  CellError,
  GeojsonColumn,
  ObjectColumn,
} from "@fairspec/metadata"
import { inspectJsonValue } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { isObject } from "../../helpers.ts"
import type { Table } from "../../table/index.ts"

// TODO: Improve the implementation
// Make unblocking / handle large data / process in parallel / move processing to Rust?

export async function inspectJsonColumn(
  column: ArrayColumn | GeojsonColumn | ObjectColumn,
  table: Table,
  options?: {
    formatJsonSchema?: Record<string, any>
  },
) {
  const errors: CellError[] = []

  const formatJsonSchema = options?.formatJsonSchema
  const constraintJsonSchema = column.constraints?.jsonSchema

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
        columnFormat: column.format,
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
          columnFormat: column.format,
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
          type: "cell/jsonSchema",
          cell: String(row.source),
          columnName: column.name,
          rowNumber: row.number,
          pointer: error.pointer,
          message: error.message,
        })
      }
    }
  }

  return errors
}

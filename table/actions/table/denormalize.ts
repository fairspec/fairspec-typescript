import type { TableSchema } from "@fairspec/metadata"
import { getColumns } from "@fairspec/metadata"
import type * as pl from "nodejs-polars"
import type { DenormalizeColumnOptions } from "../../actions/column/denormalize.ts"
import { denormalizeColumn } from "../../actions/column/denormalize.ts"
import type { Table } from "../../models/table.ts"
import { mergeMissingValues } from "./helpers.ts"

export async function denormalizeTable(
  table: Table,
  tableSchema: TableSchema,
  options?: DenormalizeColumnOptions,
) {
  return table.select(
    ...Object.values(denormalizeColumns(tableSchema, options)),
  )
}

export function denormalizeColumns(
  tableSchema: TableSchema,
  options?: DenormalizeColumnOptions,
) {
  const exprs: Record<string, pl.Expr> = {}
  const columns = getColumns(tableSchema)

  for (const column of columns) {
    const mergedColumn = mergeMissingValues(column, tableSchema)
    const expr = denormalizeColumn(mergedColumn, options)
    exprs[column.name] = expr
  }

  return exprs
}

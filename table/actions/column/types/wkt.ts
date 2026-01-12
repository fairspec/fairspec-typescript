import type { CellError, WktColumn } from "@fairspec/metadata"
import { wktToGeoJSON } from "betterknown"
import * as pl from "nodejs-polars"
import type { Table } from "../../../models/table.ts"

export async function inspectWktColumn(column: WktColumn, table: Table) {
  const errors: CellError[] = []

  const frame = await table
    .withRowIndex("number", 1)
    .select(pl.col("number"), pl.col(column.name).alias("source"))
    .collect()

  for (const row of frame.toRecords() as any[]) {
    if (row.source === null) continue

    let target: unknown | undefined
    try {
      target = wktToGeoJSON(row.source)
    } catch {}

    if (!target) {
      errors.push({
        type: "cell/type",
        cell: String(row.source),
        columnName: column.name,
        columnType: column.type,
        rowNumber: row.number,
      })
    }
  }

  return errors
}

import type { CellError, WkbColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { Geometry } from "wkx-ts"
import type { Table } from "../../../models/table.ts"

export async function inspectWkbColumn(column: WkbColumn, table: Table) {
  const errors: CellError[] = []

  const frame = await table
    .withRowIndex("number", 1)
    .select(pl.col("number"), pl.col(column.name).alias("source"))
    .collect()

  for (const row of frame.toRecords() as any[]) {
    if (row.source === null) continue

    console.log(row.source)
    console.log(Buffer.from(row.source, "hex"))

    let target: unknown | undefined
    try {
      // TODO: Fix this hack
      target = Geometry._parseWkb(Buffer.from(row.source, "hex"))
    } catch (e) {
      console.log(e)
    }

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

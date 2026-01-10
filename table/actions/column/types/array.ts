import type { ArrayColumn } from "@fairspec/metadata"
import type { Table } from "../../../models/table.ts"
import { inspectDataColumn } from "./data.ts"

export async function inspectArrayColumn(column: ArrayColumn, table: Table) {
  return inspectDataColumn(column, table)
}

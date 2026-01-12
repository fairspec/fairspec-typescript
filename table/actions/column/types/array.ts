import type { ArrayColumn } from "@fairspec/metadata"
import type { Table } from "../../../models/table.ts"
import { inspectJsonColumn } from "../helpers.ts"

export async function inspectArrayColumn(column: ArrayColumn, table: Table) {
  return inspectJsonColumn(column, table)
}

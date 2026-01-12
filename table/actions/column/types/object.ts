import type { ObjectColumn } from "@fairspec/metadata"
import type { Table } from "../../../models/table.ts"
import { inspectJsonColumn } from "../helpers.ts"

export async function inspectObjectColumn(column: ObjectColumn, table: Table) {
  return inspectJsonColumn(column, table)
}

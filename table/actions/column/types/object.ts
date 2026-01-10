import type { ObjectColumn } from "@fairspec/metadata"
import type { Table } from "../../../models/table.ts"
import { inspectDataColumn } from "./data.ts"

export async function inspectObjectColumn(column: ObjectColumn, table: Table) {
  return inspectDataColumn(column, table)
}

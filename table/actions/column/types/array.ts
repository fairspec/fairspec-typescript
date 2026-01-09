import type { ArrayColumn } from "@fairspec/metadata"
import type { Table } from "../../table/index.ts"
import { inspectJsonColumn } from "./json.ts"

export async function inspectArrayColumn(column: ArrayColumn, table: Table) {
  return inspectJsonColumn(column, table)
}

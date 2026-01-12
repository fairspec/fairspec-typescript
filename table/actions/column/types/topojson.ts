import type { TopojsonColumn } from "@fairspec/metadata"
import type { Table } from "../../../models/table.ts"
import topojsonJsonSchema from "../../../schemas/topojson.json" with {
  type: "json",
}
import { inspectJsonColumn } from "./json.ts"

export async function inspectTopojsonColumn(
  column: TopojsonColumn,
  table: Table,
) {
  return inspectJsonColumn(column, table, {
    typeJsonSchema: topojsonJsonSchema,
  })
}

import type { TopojsonColumn } from "@fairspec/metadata"
import type { Table } from "../../../models/table.ts"
import topojsonJsonSchema from "../../../schemas/topojson.json" with {
  type: "json",
}
import { inspectDataColumn } from "./data.ts"

export async function inspectTopojsonColumn(
  column: TopojsonColumn,
  table: Table,
) {
  return inspectDataColumn(column, table, {
    typeJsonSchema: topojsonJsonSchema,
  })
}

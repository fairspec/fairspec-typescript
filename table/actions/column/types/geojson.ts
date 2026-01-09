import type { GeojsonColumn } from "@fairspec/metadata"
import type { Table } from "../../../models/table.ts"
import geojsonProfile from "../../../profiles/geojson.json" with {
  type: "json",
}
import { inspectJsonColumn } from "./json.ts"

export async function inspectGeojsonColumn(
  column: GeojsonColumn,
  table: Table,
) {
  return inspectJsonColumn(column, table, {
    typeJsonSchema: geojsonProfile,
  })
}

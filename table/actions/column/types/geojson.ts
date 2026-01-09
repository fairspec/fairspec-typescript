import type { GeojsonColumn } from "@fairspec/metadata"
import geojson from "../../assets/geojson.json" with { type: "json" }
import topojson from "../../assets/topojson.json" with { type: "json" }
import type { Table } from "../../table/index.ts"
import { inspectJsonColumn } from "./json.ts"

export async function inspectGeojsonColumn(column: GeojsonColumn, table: Table) {
  return inspectJsonColumn(column, table, {
    formatJsonSchema: column.format === "topojson" ? topojson : geojson,
  })
}

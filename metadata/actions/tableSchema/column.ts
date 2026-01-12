import { objectEntries } from "ts-extras"
import type { Column } from "../../models/column/column.ts"
import type { TableSchema } from "../../models/tableSchema.ts"

export function getColumnProperties(columns: Column[]) {
  return Object.fromEntries(
    columns.map(column => [column.name, column.property]),
  )
}

// TODO: It should type error if not all columns have its case covered
export function getColumns(tableSchema: TableSchema) {
  const columns: Column[] = []

  for (const [name, property] of objectEntries(tableSchema.properties ?? {})) {
    switch (property.type) {
      case "boolean":
        columns.push({ name, type: "boolean", property })
        break
      case "integer":
        switch (property.format) {
          case "categorical":
            columns.push({ name, type: "categorical", property })
            break
          case undefined:
            columns.push({ name, type: "integer", property })
            break
        }
        break
      case "number":
        columns.push({ name, type: "number", property })
        break
      case "string":
        switch (property.format) {
          case "categorical":
            columns.push({ name, type: "categorical", property })
            break
          case "list":
            columns.push({ name, type: "list", property })
            break
          case "base64":
            columns.push({ name, type: "base64", property })
            break
          case "hex":
            columns.push({ name, type: "hex", property })
            break
          case "email":
            columns.push({ name, type: "email", property })
            break
          case "url":
            columns.push({ name, type: "url", property })
            break
          case "date-time":
            columns.push({ name, type: "date-time", property })
            break
          case "date":
            columns.push({ name, type: "date", property })
            break
          case "time":
            columns.push({ name, type: "time", property })
            break
          case "duration":
            columns.push({ name, type: "duration", property })
            break
          case "wkt":
            columns.push({ name, type: "wkt", property })
            break
          case "wkb":
            columns.push({ name, type: "wkb", property })
            break
          case undefined:
            columns.push({ name, type: "string", property })
            break
        }
        break
      case "array":
        columns.push({ name, type: "array", property })
        break
      case "object":
        switch (property.format) {
          case "geojson":
            columns.push({ name, type: "geojson", property })
            break
          case "topojson":
            columns.push({ name, type: "topojson", property })
            break
          case undefined:
            columns.push({ name, type: "object", property })
            break
        }
        break
      default:
        columns.push({ name, type: "unknown", property })
        break
    }
  }

  return columns
}

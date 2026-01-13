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
    const required = tableSchema.required?.includes(name)
    const baseColumn = { name, required }

    switch (property.type) {
      case "boolean":
        columns.push({ ...baseColumn, type: "boolean", property })
        break
      case "integer":
        switch (property.format) {
          case "categorical":
            columns.push({ ...baseColumn, type: "categorical", property })
            break
          case undefined:
            columns.push({ ...baseColumn, type: "integer", property })
            break
        }
        break
      case "number":
        columns.push({ ...baseColumn, type: "number", property })
        break
      case "string":
        switch (property.format) {
          case "categorical":
            columns.push({ ...baseColumn, type: "categorical", property })
            break
          case "list":
            columns.push({ ...baseColumn, type: "list", property })
            break
          case "base64":
            columns.push({ ...baseColumn, type: "base64", property })
            break
          case "hex":
            columns.push({ ...baseColumn, type: "hex", property })
            break
          case "email":
            columns.push({ ...baseColumn, type: "email", property })
            break
          case "url":
            columns.push({ ...baseColumn, type: "url", property })
            break
          case "date-time":
            columns.push({ ...baseColumn, type: "date-time", property })
            break
          case "date":
            columns.push({ ...baseColumn, type: "date", property })
            break
          case "time":
            columns.push({ ...baseColumn, type: "time", property })
            break
          case "duration":
            columns.push({ ...baseColumn, type: "duration", property })
            break
          case "wkt":
            columns.push({ ...baseColumn, type: "wkt", property })
            break
          case "wkb":
            columns.push({ ...baseColumn, type: "wkb", property })
            break
          case undefined:
            columns.push({ ...baseColumn, type: "string", property })
            break
        }
        break
      case "array":
        columns.push({ ...baseColumn, type: "array", property })
        break
      case "object":
        switch (property.format) {
          case "geojson":
            columns.push({ ...baseColumn, type: "geojson", property })
            break
          case "topojson":
            columns.push({ ...baseColumn, type: "topojson", property })
            break
          case undefined:
            columns.push({ ...baseColumn, type: "object", property })
            break
        }
        break
      default:
        columns.push({ ...baseColumn, type: "unknown", property })
        break
    }
  }

  return columns
}

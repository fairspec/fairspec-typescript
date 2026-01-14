import type { Column, ColumnProperty } from "../../models/column/column.ts"

export function composeColumn(name: string, property: ColumnProperty): Column {
  switch (property.type) {
    case "boolean":
      return { type: "boolean", name, property }
    case "integer":
      switch (property.format) {
        case "categorical":
          return { type: "categorical", name, property }
        default:
          return { type: "integer", name, property }
      }
    case "number":
      return { type: "number", name, property }
    case "string":
      switch (property.format) {
        case "categorical":
          return { type: "categorical", name, property }
        case "decimal":
          return { type: "decimal", name, property }
        case "list":
          return { type: "list", name, property }
        case "base64":
          return { type: "base64", name, property }
        case "hex":
          return { type: "hex", name, property }
        case "email":
          return { type: "email", name, property }
        case "url":
          return { type: "url", name, property }
        case "date-time":
          return { type: "date-time", name, property }
        case "date":
          return { type: "date", name, property }
        case "time":
          return { type: "time", name, property }
        case "duration":
          return { type: "duration", name, property }
        case "wkt":
          return { type: "wkt", name, property }
        case "wkb":
          return { type: "wkb", name, property }
        default:
          return { type: "string", name, property }
      }
    case "array":
      return { type: "array", name, property }
    case "object":
      switch (property.format) {
        case "geojson":
          return { type: "geojson", name, property }
        case "topojson":
          return { type: "topojson", name, property }
        default:
          return { type: "object", name, property }
      }
    default:
      return { type: "unknown", name, property }
  }
}

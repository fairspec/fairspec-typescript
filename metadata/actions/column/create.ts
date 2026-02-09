import type { Column, ColumnProperty } from "../../models/column/column.ts"
import { getBasePropertyType, getIsNullablePropertyType } from "./property.ts"

export function createColumnFromProperty(
  name: string,
  property: ColumnProperty,
): Column {
  const propertyType = property.type ?? "null"
  const baseType = getBasePropertyType(propertyType)
  const format = "format" in property ? property.format : undefined
  const nullable = getIsNullablePropertyType(propertyType) || undefined

  let columnType: string
  switch (baseType) {
    case "boolean":
      columnType = "boolean"
      break
    case "integer":
      columnType = format === "categorical" ? "categorical" : "integer"
      break
    case "number":
      columnType = "number"
      break
    case "string":
      switch (format) {
        case "categorical":
          columnType = "categorical"
          break
        case "decimal":
          columnType = "decimal"
          break
        case "list":
          columnType = "list"
          break
        case "base64":
          columnType = "base64"
          break
        case "hex":
          columnType = "hex"
          break
        case "email":
          columnType = "email"
          break
        case "url":
          columnType = "url"
          break
        case "date-time":
          columnType = "date-time"
          break
        case "date":
          columnType = "date"
          break
        case "time":
          columnType = "time"
          break
        case "duration":
          columnType = "duration"
          break
        case "wkt":
          columnType = "wkt"
          break
        case "wkb":
          columnType = "wkb"
          break
        default:
          columnType = "string"
          break
      }
      break
    case "array":
      columnType = "array"
      break
    case "object":
      switch (format) {
        case "geojson":
          columnType = "geojson"
          break
        case "topojson":
          columnType = "topojson"
          break
        default:
          columnType = "object"
          break
      }
      break
    default:
      columnType = "unknown"
      break
  }

  return { type: columnType, name, nullable, property } as Column
}

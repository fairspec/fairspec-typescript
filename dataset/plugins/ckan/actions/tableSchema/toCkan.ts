import type { Column, TableSchema } from "@fairspec/metadata"
import type { CkanField, CkanFieldInfo } from "../../models/Field.ts"
import type { CkanSchema } from "../../models/Schema.ts"

export function convertTableSchemaToCkan(tableSchema: TableSchema): CkanSchema {
  const fields: CkanField[] = []

  for (const [columnName, column] of Object.entries(tableSchema.properties)) {
    fields.push(convertColumn(columnName, column))
  }

  return { fields }
}

function convertColumn(columnName: string, column: Column): CkanField {
  const { title, description } = column

  const ckanField: CkanField = {
    id: columnName,
    type: convertType(column),
  }

  if (title || description) {
    const columnInfo: CkanFieldInfo = {} as CkanFieldInfo

    if (title) columnInfo.label = title
    if (description) columnInfo.notes = description

    columnInfo.type_override = convertType(column)

    ckanField.info = columnInfo
  }

  return ckanField
}

function convertType(column: Column): string {
  if (column.type === "string" && "format" in column) {
    switch (column.format) {
      case "date":
        return "date"
      case "time":
        return "time"
      case "date-time":
        return "timestamp"
      default:
        return "text"
    }
  }

  switch (column.type) {
    case "string":
      return "text"
    case "integer":
      return "int"
    case "number":
      return "numeric"
    case "boolean":
      return "bool"
    case "object":
      return "json"
    case "array":
      return "array"
    default:
      return "text"
  }
}

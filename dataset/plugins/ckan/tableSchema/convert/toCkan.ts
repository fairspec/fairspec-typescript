import type { Column, TableSchema } from "@fairspec/metadata"
import type { CkanColumn, CkanColumnInfo } from "../Column.ts"
import type { CkanTableSchema } from "../TableSchema.ts"

export function convertTableSchemaToCkan(
  schema: TableSchema,
): CkanTableSchema {
  const fields: CkanColumn[] = []

  for (const [columnName, column] of Object.entries(schema.properties)) {
    fields.push(convertColumn(columnName, column))
  }

  return { fields }
}

function convertColumn(columnName: string, column: Column): CkanColumn {
  const { title, description } = column

  const ckanColumn: CkanColumn = {
    id: columnName,
    type: convertType(column),
  }

  if (title || description) {
    const columnInfo: CkanColumnInfo = {} as CkanColumnInfo

    if (title) columnInfo.label = title
    if (description) columnInfo.notes = description

    columnInfo.type_override = convertType(column)

    ckanColumn.info = columnInfo
  }

  return ckanColumn
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

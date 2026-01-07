import type {
  ArrayColumn,
  BooleanColumn,
  Column,
  DateColumn,
  DatetimeColumn,
  IntegerColumn,
  NumberColumn,
  ObjectColumn,
  StringColumn,
  TableSchema,
  TimeColumn,
} from "@fairspec/metadata"
import type { CkanColumn } from "../Column.ts"
import type { CkanTableSchema } from "../TableSchema.ts"

export function convertTableSchemaFromCkan(
  ckanTableSchema: CkanTableSchema,
): TableSchema {
  const properties: Record<string, Column> = {}

  for (const ckanColumn of ckanTableSchema.fields) {
    properties[ckanColumn.id] = convertColumn(ckanColumn)
  }

  return {
    $schema: "https://fairspec.org/profiles/latest/table.json",
    properties,
  }
}

function convertColumn(ckanColumn: CkanColumn): Column {
  const { info } = ckanColumn

  const baseColumn: {
    title?: string
    description?: string
  } = {}

  if (info) {
    if (info.label) baseColumn.title = info.label
    if (info.notes) baseColumn.description = info.notes
  }

  const columnType = (info?.type_override || ckanColumn.type).toLowerCase()
  switch (columnType) {
    case "text":
    case "string":
      return { ...baseColumn, type: "string" } as StringColumn
    case "int":
    case "integer":
      return { ...baseColumn, type: "integer" } as IntegerColumn
    case "numeric":
    case "number":
    case "float":
      return { ...baseColumn, type: "number" } as NumberColumn
    case "bool":
    case "boolean":
      return { ...baseColumn, type: "boolean" } as BooleanColumn
    case "date":
      return { ...baseColumn, type: "string", format: "date" } as DateColumn
    case "time":
      return { ...baseColumn, type: "string", format: "time" } as TimeColumn
    case "timestamp":
    case "datetime":
      return {
        ...baseColumn,
        type: "string",
        format: "date-time",
      } as DatetimeColumn
    case "json":
    case "object":
      return { ...baseColumn, type: "object" } as ObjectColumn
    case "array":
      return { ...baseColumn, type: "array" } as ArrayColumn
    default:
      return { ...baseColumn, type: "string" } as StringColumn
  }
}

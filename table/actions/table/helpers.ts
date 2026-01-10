import type { Column, TableSchema } from "@fairspec/metadata"
import { copyDescriptor } from "@fairspec/metadata"

export function mergeMissingValues(column: Column, tableSchema: TableSchema) {
  if (!tableSchema.missingValues) {
    return column
  }

  const mergedColumn = copyDescriptor(column)
  mergedColumn.property.missingValues = column.property.missingValues ?? []

  // We ensure that numeric missing values don't sneak in string columns
  // TODO: Why types don't catch missmatch?
  for (const item of tableSchema.missingValues) {
    if (mergedColumn.property.type === "string") {
      const value = typeof item === "object" ? item.value : item
      if (typeof value !== "string") continue
    }

    mergedColumn.property.missingValues.push(item)
  }

  return mergedColumn
}

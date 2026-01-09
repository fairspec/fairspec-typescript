import type { Column } from "@fairspec/metadata"
import type { SchemaMapping } from "../../models/schema.ts"

export function matchSchemaColumn(
  mapping: SchemaMapping,
  column: Column,
  index: number,
) {
  const columnsMatch = mapping.target.columnsMatch ?? "exact"

  const polarsColumn =
    columnsMatch !== "exact"
      ? mapping.source.columns.find(it => it.name === column.name)
      : mapping.source.columns[index]

  return polarsColumn ? { source: polarsColumn, target: column } : undefined
}

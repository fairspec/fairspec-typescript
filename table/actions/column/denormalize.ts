import type { Column } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import type { ColumnMapping } from "../../models/column.ts"
import { desubstituteColumn } from "./desubstitute.ts"
import { stringifyColumn } from "./stringify.ts"

export type DenormalizeColumnOptions = {
  nativeTypes?: Column["type"][]
}

export function denormalizeColumn(
  mapping: ColumnMapping,
  options?: DenormalizeColumnOptions,
) {
  let columnExpr = pl.col(mapping.source.name)

  if (!options?.nativeTypes?.includes(mapping.target.type)) {
    columnExpr = stringifyColumn(mapping, columnExpr)
  }

  columnExpr = desubstituteColumn(mapping, columnExpr, options)
  return columnExpr
}

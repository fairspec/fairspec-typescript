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
  let expr = pl.col(mapping.source.name)
  const { nativeTypes } = options ?? {}

  if (!nativeTypes?.includes(mapping.target.type)) {
    expr = stringifyColumn(mapping, expr)
    expr = desubstituteColumn(mapping.target, expr)
  }

  return expr
}

import type { Column } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { desubstituteColumn } from "./desubstitute.ts"
import { stringifyColumn } from "./stringify.ts"

export type DenormalizeColumnOptions = {
  nativeTypes?: Column["type"][]
}

export function denormalizeColumn(
  column: Column,
  options?: DenormalizeColumnOptions,
) {
  let expr = pl.col(column.name)
  const { nativeTypes } = options ?? {}

  if (!nativeTypes?.includes(column.type)) {
    expr = stringifyColumn(column, expr)
    expr = desubstituteColumn(column, expr)
  }

  return expr
}

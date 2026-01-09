import * as pl from "nodejs-polars"
import type { Field } from "@fairspec/metadata"
import type { PolarsField } from "./Field.ts"

export type PolarsField = {
  name: string
  type: pl.DataType
}

export interface FieldMapping {
  source: PolarsField
  target: Field
}

export interface CellMapping {
  source: pl.Expr
  target: pl.Expr
}

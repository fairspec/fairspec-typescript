import type { Column } from "@fairspec/metadata"
import type * as pl from "nodejs-polars"

export type PolarsColumn = {
  name: string
  type: pl.DataType
}

export interface ColumnMapping {
  source: PolarsColumn
  target: Column
}

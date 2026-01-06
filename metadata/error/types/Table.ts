import { z } from "zod"
import { CellError } from "./Cell.ts"
import { ColumnError } from "./Column.ts"
import { ForeignKeyError } from "./ForeignKey.ts"
import { RowError } from "./Row.ts"

export const TableError = z.union([
  ColumnError,
  RowError,
  CellError,
  ForeignKeyError,
])

export type TableError = z.infer<typeof TableError>

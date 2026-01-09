import type { Column } from "@fairspec/metadata"
import type * as pl from "nodejs-polars"
import { stringifyBooleanColumn } from "./types/boolean.ts"
import { stringifyDateColumn } from "./types/date.ts"
import { stringifyDatetimeColumn } from "./types/datetime.ts"
import { stringifyDurationColumn } from "./types/duration.ts"
import { stringifyIntegerColumn } from "./types/integer.ts"
import { stringifyListColumn } from "./types/list.ts"
import { stringifyNumberColumn } from "./types/number.ts"
import { stringifyTimeColumn } from "./types/time.ts"

export function stringifyColumn(column: Column, columnExpr: pl.Expr) {
  switch (column.type) {
    case "boolean":
      return stringifyBooleanColumn(column, columnExpr)
    case "date":
      return stringifyDateColumn(column, columnExpr)
    case "datetime":
      return stringifyDatetimeColumn(column, columnExpr)
    case "duration":
      return stringifyDurationColumn(column, columnExpr)
    case "integer":
      return stringifyIntegerColumn(column, columnExpr)
    case "list":
      return stringifyListColumn(column, columnExpr)
    case "number":
      return stringifyNumberColumn(column, columnExpr)
    case "time":
      return stringifyTimeColumn(column, columnExpr)
    default:
      return columnExpr
  }
}

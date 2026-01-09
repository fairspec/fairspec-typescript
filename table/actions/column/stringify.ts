import type { Column } from "@fairspec/metadata"
import type * as pl from "nodejs-polars"
import { stringifyBooleanColumn } from "./types/boolean.ts"
import { stringifyDateColumn } from "./types/date.ts"
import { stringifyDatetimeColumn } from "./types/datetime.ts"
import { stringifyDurationColumn } from "./types/duration.ts"
import { stringifyGeopointColumn } from "./types/geopoint.ts"
import { stringifyIntegerColumn } from "./types/integer.ts"
import { stringifyListColumn } from "./types/list.ts"
import { stringifyNumberColumn } from "./types/number.ts"
import { stringifyStringColumn } from "./types/string.ts"
import { stringifyTimeColumn } from "./types/time.ts"
import { stringifyYearColumn } from "./types/year.ts"
import { stringifyYearmonthColumn } from "./types/yearmonth.ts"

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
    case "geopoint":
      return stringifyGeopointColumn(column, columnExpr)
    case "integer":
      return stringifyIntegerColumn(column, columnExpr)
    case "list":
      return stringifyListColumn(column, columnExpr)
    case "number":
      return stringifyNumberColumn(column, columnExpr)
    case "string":
      return stringifyStringColumn(column, columnExpr)
    case "time":
      return stringifyTimeColumn(column, columnExpr)
    case "year":
      return stringifyYearColumn(column, columnExpr)
    case "yearmonth":
      return stringifyYearmonthColumn(column, columnExpr)
    default:
      return columnExpr
  }
}

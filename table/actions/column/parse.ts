import * as pl from "nodejs-polars"
import type { ColumnMapping } from "../../models/column.ts"
import { parseBooleanColumn } from "./types/boolean.ts"
import { parseDateColumn } from "./types/date.ts"
import { parseDatetimeColumn } from "./types/datetime.ts"
import { parseDurationColumn } from "./types/duration.ts"
import { parseGeopointColumn } from "./types/geopoint.ts"
import { parseIntegerColumn } from "./types/integer.ts"
import { parseListColumn } from "./types/list.ts"
import { parseNumberColumn } from "./types/number.ts"
import { parseStringColumn } from "./types/string.ts"
import { parseTimeColumn } from "./types/time.ts"
import { parseYearColumn } from "./types/year.ts"
import { parseYearmonthColumn } from "./types/yearmonth.ts"

export function parseColumn(mapping: ColumnMapping, columnExpr: pl.Expr) {
  if (!mapping.source.type.equals(pl.String)) return columnExpr

  const column = mapping.target
  switch (column.type) {
    case "boolean":
      return parseBooleanColumn(column, columnExpr)
    case "date":
      return parseDateColumn(column, columnExpr)
    case "datetime":
      return parseDatetimeColumn(column, columnExpr)
    case "duration":
      return parseDurationColumn(column, columnExpr)
    case "geopoint":
      return parseGeopointColumn(column, columnExpr)
    case "integer":
      return parseIntegerColumn(column, columnExpr)
    case "list":
      return parseListColumn(column, columnExpr)
    case "number":
      return parseNumberColumn(column, columnExpr)
    case "string":
      return parseStringColumn(column, columnExpr)
    case "time":
      return parseTimeColumn(column, columnExpr)
    case "year":
      return parseYearColumn(column, columnExpr)
    case "yearmonth":
      return parseYearmonthColumn(column, columnExpr)
    default:
      return columnExpr
  }
}

import type { EmailColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { z } from "zod"

export function parseEmailColumn(column: EmailColumn, columnExpr: pl.Expr) {
  return pl
    .when(columnExpr.str.contains(z.regexes.email))
    .then(columnExpr)
    .otherwise(pl.lit(null))
    .alias(column.name)
}

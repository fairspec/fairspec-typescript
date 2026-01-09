import type { EmailColumn } from "@fairspec/metadata"
import type * as pl from "nodejs-polars"
import { z } from "zod"
import { parseStringColumn } from "./string.ts"

export function parseEmailColumn(column: EmailColumn, columnExpr: pl.Expr) {
  return parseStringColumn(column, columnExpr, {
    regex: z.regexes.email,
  })
}

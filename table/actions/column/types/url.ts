import type { UrlColumn } from "@fairspec/metadata"
import type * as pl from "nodejs-polars"
import { parseStringColumn } from "./string.ts"

export function parseUrlColumn(column: UrlColumn, columnExpr: pl.Expr) {
  return parseStringColumn(column, columnExpr, {
    // TODO: Update after fixed?
    // https://github.com/colinhacks/zod/pull/3497
    regex: /^https?:\/\/.+/,
  })
}

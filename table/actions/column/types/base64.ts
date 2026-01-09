import type { Base64Column } from "@fairspec/metadata"
import type * as pl from "nodejs-polars"
import { z } from "zod"
import { parseStringColumn } from "./string.ts"

export function parseBase64Column(column: Base64Column, columnExpr: pl.Expr) {
  return parseStringColumn(column, columnExpr, {
    regex: z.regexes.base64,
  })
}

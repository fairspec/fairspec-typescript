import type { HexColumn } from "@fairspec/metadata"
import type * as pl from "nodejs-polars"
import { z } from "zod"
import { parseStringColumn } from "./string.ts"

export function parseHexColumn(column: HexColumn, columnExpr: pl.Expr) {
  return parseStringColumn(column, columnExpr, {
    regex: z.regexes.hex,
  })
}

export function stringifyHexColumn(_column: HexColumn, columnExpr: pl.Expr) {
  return columnExpr
}

import type { RowPrimaryKeyError, RowUniqueKeyError } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import type { SchemaMapping } from "../../../models/schema.ts"

export function createRowKeyChecks(mapping: SchemaMapping) {
  const uniqueKeys = mapping.target.uniqueKeys ?? []
  const primaryKey = mapping.target.primaryKey

  const checks = [
    ...(primaryKey ? [createCheckRowPrimaryKey(primaryKey)] : []),
    ...uniqueKeys.map(createCheckRowUniqueKey),
  ]

  return checks
}

// TODO: Remove duplication

function createCheckRowPrimaryKey(uniqueKey: string[]) {
  const isErrorExpr = pl
    .concatList(uniqueKey)
    .isFirstDistinct()
    .not()
    // Fold is not available so we use a tricky way to eliminate nulls
    .and(pl.concatList(uniqueKey).lst.min().isNotNull())

  const errorTemplate: RowPrimaryKeyError = {
    type: "row/primaryKey",
    columnNames: uniqueKey,
    rowNumber: 0,
  }

  return { isErrorExpr, errorTemplate }
}

function createCheckRowUniqueKey(uniqueKey: string[]) {
  const isErrorExpr = pl
    .concatList(uniqueKey)
    .isFirstDistinct()
    .not()
    // Fold is not available so we use a tricky way to eliminate nulls
    .and(pl.concatList(uniqueKey).lst.min().isNotNull())

  const errorTemplate: RowUniqueKeyError = {
    type: "row/uniqueKey",
    columnNames: uniqueKey,
    rowNumber: 0,
  }

  return { isErrorExpr, errorTemplate }
}

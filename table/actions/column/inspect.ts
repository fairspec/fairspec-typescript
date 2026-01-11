import type {
  CellError,
  Column,
  ColumnError,
  TableError,
} from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import type { ColumnMapping } from "../../models/column.ts"
import type { Table } from "../../models/table.ts"
import { checkCellEnum } from "./checks/enum.ts"
import { createCheckCellMaximum } from "./checks/maximum.ts"
import { checkCellMaxLength } from "./checks/maxLength.ts"
import { createCheckCellMinimum } from "./checks/minimum.ts"
import { checkCellMinLength } from "./checks/minLength.ts"
import { checkCellPattern } from "./checks/pattern.ts"
import { checkCellType } from "./checks/type.ts"
import { normalizeColumn } from "./normalize.ts"
import { inspectArrayColumn } from "./types/array.ts"
import { inspectGeojsonColumn } from "./types/geojson.ts"
import { inspectObjectColumn } from "./types/object.ts"

export async function inspectColumn(
  mapping: ColumnMapping,
  table: Table,
  options: {
    maxErrors: number
  },
) {
  const { maxErrors } = options
  const errors: TableError[] = []

  const typeErrors = inspectType(mapping)
  errors.push(...typeErrors)

  if (!typeErrors.length) {
    const dataErorrs = await inspectCells(mapping, table, { maxErrors })
    errors.push(...dataErorrs)
  }

  return errors
}

function inspectType(mapping: ColumnMapping) {
  const errors: ColumnError[] = []
  const variant = mapping.source.type.variant

  // TODO: Rebase on proper polars type definition when available
  // https://github.com/pola-rs/nodejs-polars/issues/372
  const compatMapping: Record<string, Column["type"][]> = {
    Bool: ["boolean"],
    Categorical: ["string"],
    Date: ["date"],
    Datetime: ["datetime"],
    Float32: ["number", "integer"],
    Float64: ["number", "integer"],
    Int16: ["integer"],
    Int32: ["integer"],
    Int64: ["integer"],
    Int8: ["integer"],
    List: ["list"],
    String: ["unknown"],
    Time: ["time"],
    UInt16: ["integer"],
    UInt32: ["integer"],
    UInt64: ["integer"],
    UInt8: ["integer"],
    Utf8: ["unknown"],
  }

  const compatTypes = compatMapping[variant] ?? []
  const isCompat = !!new Set(compatTypes).intersection(
    new Set([mapping.target.type, "unknown"]),
  ).size

  if (!isCompat) {
    errors.push({
      type: "column/type",
      columnName: mapping.target.name,
      expectedColumnType: mapping.target.type,
      actualColumnType: compatTypes[0] ?? "unknown",
    })
  }

  return errors
}

async function inspectCells(
  mapping: ColumnMapping,
  table: Table,
  options: {
    maxErrors: number
  },
) {
  const { maxErrors } = options
  const errors: CellError[] = []

  // Types that require non-polars validation
  switch (mapping.target.type) {
    case "array":
      return await inspectArrayColumn(mapping.target, table)
    case "geojson":
      return await inspectGeojsonColumn(mapping.target, table)
    case "object":
      return await inspectObjectColumn(mapping.target, table)
  }

  let columnCheckTable = table
    .withRowCount()
    .select(
      pl.col("row_nr").add(1).alias("number"),
      normalizeColumn(mapping).alias("target"),
      normalizeColumn(mapping, { keepType: true }).alias("source"),
      pl.lit(null).alias("error"),
    )

  for (const checkCell of [
    checkCellType,
    checkCellPattern,
    checkCellEnum,
    createCheckCellMinimum(),
    createCheckCellMaximum(),
    createCheckCellMinimum({ isExclusive: true }),
    createCheckCellMaximum({ isExclusive: true }),
    checkCellMinLength,
    checkCellMaxLength,
  ]) {
    const cellMapping = { source: pl.col("source"), target: pl.col("target") }

    const check = checkCell(mapping.target, cellMapping)
    if (!check) continue

    columnCheckTable = columnCheckTable.withColumn(
      pl
        .when(pl.col("error").isNotNull())
        .then(pl.col("error"))
        .when(check.isErrorExpr)
        .then(pl.lit(JSON.stringify(check.errorTemplate)))
        .otherwise(pl.lit(null))
        .alias("error"),
    )
  }

  const columnCheckFrame = await columnCheckTable
    .filter(pl.col("error").isNotNull())
    .drop(["target"])
    .head(maxErrors)
    .collect()

  for (const row of columnCheckFrame.toRecords() as any[]) {
    const errorTemplate = JSON.parse(row.error) as CellError
    errors.push({
      ...errorTemplate,
      rowNumber: row.number,
      cell: String(row.source ?? ""),
    })
  }

  return errors
}

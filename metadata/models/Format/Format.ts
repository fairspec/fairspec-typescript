import { z } from "zod"
import { ArrowFormat } from "./Arrow.ts"
import { CsvFormat } from "./Csv.ts"
import { JsonFormat } from "./Json.ts"
import { JsonlFormat } from "./Jsonl.ts"
import { OdsFormat } from "./Ods.ts"
import { ParquetFormat } from "./Parquet.ts"
import { SqliteFormat } from "./Sqlite.ts"
import { TsvFormat } from "./Tsv.ts"
import { XlsxFormat } from "./Xlsx.ts"

export const Format = z.discriminatedUnion("name", [
  CsvFormat,
  TsvFormat,
  JsonFormat,
  JsonlFormat,
  XlsxFormat,
  OdsFormat,
  SqliteFormat,
  ParquetFormat,
  ArrowFormat,
])

export type Format = z.infer<typeof Format>

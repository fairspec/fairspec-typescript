import { z } from "zod"
import { ArrowFormat } from "./arrow.ts"
import { CsvFormat } from "./csv.ts"
import { CustomFormat } from "./custom.ts"
import { JsonFormat } from "./json.ts"
import { JsonlFormat } from "./jsonl.ts"
import { OdsFormat } from "./ods.ts"
import { ParquetFormat } from "./parquet.ts"
import { SqliteFormat } from "./sqlite.ts"
import { TsvFormat } from "./tsv.ts"
import { XlsxFormat } from "./xlsx.ts"

export const Format = z.discriminatedUnion("type", [
  CsvFormat,
  TsvFormat,
  JsonFormat,
  JsonlFormat,
  XlsxFormat,
  OdsFormat,
  SqliteFormat,
  ParquetFormat,
  ArrowFormat,
  CustomFormat,
])

export type Format = z.infer<typeof Format>

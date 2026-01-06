import { z } from "zod"
import { ArrowFormat } from "./types/Arrow.ts"
import { CsvFormat } from "./types/Csv.ts"
import { JsonFormat } from "./types/Json.ts"
import { JsonlFormat } from "./types/Jsonl.ts"
import { OdsFormat } from "./types/Ods.ts"
import { ParquetFormat } from "./types/Parquet.ts"
import { SqliteFormat } from "./types/Sqlite.ts"
import { TsvFormat } from "./types/Tsv.ts"
import { XlsxFormat } from "./types/Xlsx.ts"

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

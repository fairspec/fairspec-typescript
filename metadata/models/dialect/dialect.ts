import { z } from "zod"
import { ArrowDialect } from "./arrow.ts"
import { CsvDialect } from "./csv.ts"
import { JsonDialect } from "./json.ts"
import { JsonlDialect } from "./jsonl.ts"
import { OdsDialect } from "./ods.ts"
import { ParquetDialect } from "./parquet.ts"
import { SqliteDialect } from "./sqlite.ts"
import { TsvDialect } from "./tsv.ts"
// import { UnknownDialect } from "./unknown.ts"
import { XlsxDialect } from "./xlsx.ts"

// TODO: Recovert support for unknown dialects
// Currently, it causes zod discriminated union to throw an error

export const Dialect = z.discriminatedUnion("format", [
  CsvDialect,
  TsvDialect,
  JsonDialect,
  JsonlDialect,
  XlsxDialect,
  OdsDialect,
  SqliteDialect,
  ParquetDialect,
  ArrowDialect,
  // UnknownDialect,
])

export type Dialect = z.infer<typeof Dialect>

import type { Column, ListColumn, TableSchema } from "@fairspec/metadata"
import type { PolarsColumn } from "./column.ts"

export interface PolarsSchema {
  columns: PolarsColumn[]
}

export interface SchemaMapping {
  source: PolarsSchema
  target: TableSchema
}

export interface TableSchemaOptions {
  columnNames?: string[]
  columnTypes?: Record<string, Column["type"]>
  missingValues?: string[]
  decimalChar?: string
  groupChar?: string
  trueValues?: string[]
  falseValues?: string[]
  datetimeFormat?: string
  dateFormat?: string
  timeFormat?: string
  arrayType?: "array" | "list"
  listDelimiter?: string
  listItemType?: ListColumn["property"]["itemType"]
}

export interface InferTableSchemaOptions extends TableSchemaOptions {
  sampleRows?: number
  confidence?: number
  commaDecimal?: boolean
  monthFirst?: boolean
  keepStrings?: boolean
}

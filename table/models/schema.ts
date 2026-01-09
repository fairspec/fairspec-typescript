import type { Column, ListColumn, TableSchema } from "@fairspec/metadata"
import type { PolarsColumn } from "./column.ts"

export interface PolarsSchema {
  columns: PolarsColumn[]
}

export interface SchemaMapping {
  source: PolarsSchema
  target: TableSchema
}

export interface SchemaOptions {
  columnNames?: string[]
  columnTypes?: Record<string, Column["type"]>
  missingValues?: string[]
  decimalChar?: string
  groupChar?: string
  bareNumber?: boolean
  trueValues?: string[]
  falseValues?: string[]
  datetimeFormat?: string
  dateFormat?: string
  timeFormat?: string
  arrayType?: "array" | "list"
  listDelimiter?: string
  listItemType?: ListColumn["property"]["itemType"]
}

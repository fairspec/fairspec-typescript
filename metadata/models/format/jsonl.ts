import { z } from "zod"
import { ColumnNames, HeaderJoin, HeaderRows, RowType } from "./common.ts"

export const JsonlFormat = z.object({
  name: z.literal("jsonl"),
  rowType: RowType.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  columnNames: ColumnNames.optional(),
})

export type JsonlFormat = z.infer<typeof JsonlFormat>

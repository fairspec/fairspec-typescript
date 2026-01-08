import { z } from "zod"
import {
  ColumnNames,
  HeaderJoin,
  HeaderRows,
  JsonPointer,
  RowType,
} from "./common.ts"

export const JsonFormat = z.object({
  name: z.literal("json"),
  jsonPointer: JsonPointer.optional(),
  rowType: RowType.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  columnNames: ColumnNames.optional(),
})

export type JsonFormat = z.infer<typeof JsonFormat>

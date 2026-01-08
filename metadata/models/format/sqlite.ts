import { z } from "zod"
import { TableName } from "./common.ts"

export const SqliteFormat = z.object({
  name: z.literal("sqlite"),
  tableName: TableName.optional(),
})

export type SqliteFormat = z.infer<typeof SqliteFormat>

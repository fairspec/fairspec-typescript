import { z } from "zod"
import { BaseFormat } from "./base.ts"
import { TableName } from "./common.ts"

export const SqliteFormat = BaseFormat.extend({
  name: z.literal("sqlite"),
  tableName: TableName.optional(),
})

export type SqliteFormat = z.infer<typeof SqliteFormat>

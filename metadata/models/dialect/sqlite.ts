import { z } from "zod"
import { BaseDialect } from "./base.ts"
import { TableName } from "./common.ts"

export const SqliteDialect = BaseDialect.extend({
  format: z.literal("sqlite"),
  tableName: TableName.optional(),
})

export type SqliteDialect = z.infer<typeof SqliteDialect>

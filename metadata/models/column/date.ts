import { z } from "zod"
import { StringColumn } from "./string.ts"

export const DateColumn = StringColumn.extend({
  format: z.literal("date"),

  temporalFormat: z
    .string()
    .optional()
    .describe(
      "An optional string specifying the datetime format pattern as per the Strftime specification",
    ),
})

export type DateColumn = z.infer<typeof DateColumn>

import { z } from "zod"
import { StringColumn } from "./String.ts"

export const DatetimeColumn = StringColumn.extend({
  format: z.literal("date-time"),

  temporalFormat: z
    .string()
    .optional()
    .describe(
      "An optional string specifying the datetime format pattern as per the Strftime specification",
    ),
})

export type DatetimeColumn = z.infer<typeof DatetimeColumn>

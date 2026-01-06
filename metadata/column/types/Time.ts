import { z } from "zod"
import { StringColumn } from "./String.ts"

export const TimeColumn = StringColumn.extend({
  format: z.literal("time"),

  temporalFormat: z
    .string()
    .optional()
    .describe(
      "An optional string specifying the datetime format pattern as per the Strftime specification",
    ),
})

export type TimeColumn = z.infer<typeof TimeColumn>

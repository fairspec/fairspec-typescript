import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const DatetimeColumn = BaseStringColumn.extend({
  type: z.literal("datetime"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("date-time"),

    temporalFormat: z
      .string()
      .optional()
      .describe(
        "An optional string specifying the datetime format pattern as per the Strftime specification",
      ),
  }),
})

export type DatetimeColumn = z.infer<typeof DatetimeColumn>

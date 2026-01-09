import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const DatetimeColumn = BaseColumn.extend({
  type: z.literal("datetime"),
  property: StringColumn.shape.property.extend({
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

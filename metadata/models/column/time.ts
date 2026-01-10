import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const TimeColumn = BaseStringColumn.extend({
  type: z.literal("time"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("time"),

    temporalFormat: z
      .string()
      .optional()
      .describe(
        "An optional string specifying the datetime format pattern as per the Strftime specification",
      ),
  }),
})

export type TimeColumn = z.infer<typeof TimeColumn>

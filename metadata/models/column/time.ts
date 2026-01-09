import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const TimeColumn = BaseColumn.extend({
  type: z.literal("time"),
  property: StringColumn.shape.property.extend({
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

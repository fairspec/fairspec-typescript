import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const DateColumn = BaseStringColumn.extend({
  type: z.literal("date"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("date"),

    temporalFormat: z
      .string()
      .optional()
      .describe(
        "An optional string specifying the datetime format pattern as per the Strftime specification",
      ),
  }),
})

export type DateColumn = z.infer<typeof DateColumn>

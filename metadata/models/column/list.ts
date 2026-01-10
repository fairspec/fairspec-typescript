import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const ListColumn = BaseStringColumn.extend({
  type: z.literal("list"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("list"),

    itemType: z
      .enum([
        "string",
        "integer",
        "number",
        "boolean",
        "datetime",
        "date",
        "time",
      ])
      .optional()
      .describe("An optional type for items in a list column"),

    delimiter: z
      .string()
      .length(1)
      .optional()
      .describe(
        "An optional single character used to delimit items in a list column",
      ),
  }),
})

export type ListColumn = z.infer<typeof ListColumn>

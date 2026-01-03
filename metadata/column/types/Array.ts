import { z } from "zod"
import { BaseColumn } from "./Base.ts"

// TODO: Should allow all the JSON Schema properties

export const ArrayColumn = BaseColumn.extend({
  type: z.literal("array"),
  format: z.undefined().optional(),

  missingValues: z
    .array(
      z.union([
        z.string(),
        z.array(z.any()),
        z.object({
          value: z.union([z.string(), z.array(z.any())]),
          label: z.string(),
        }),
      ]),
    )
    .optional()
    .describe(
      "An optional column-specific list of values that represent missing or null data",
    ),
})

export type ArrayColumn = z.infer<typeof ArrayColumn>

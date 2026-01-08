import { z } from "zod"
import { BaseColumn } from "./base.ts"

// TODO: Should allow all the JSON Schema properties

export const ObjectColumn = BaseColumn.extend({
  type: z.literal("object"),
  format: z.undefined().optional(),

  missingValues: z
    .array(
      z.union([
        z.string(),
        z.record(z.string(), z.any()),
        z.object({
          value: z.union([z.string(), z.record(z.string(), z.any())]),
          label: z.string(),
        }),
      ]),
    )
    .optional()
    .describe(
      "An optional column-specific list of values that represent missing or null data",
    ),
})

export type ObjectColumn = z.infer<typeof ObjectColumn>

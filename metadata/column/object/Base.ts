import { z } from "zod"
import { BaseColumn } from "../Base.ts"

export const BaseObjectColumn = BaseColumn.extend({
  type: z.literal("object"),

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

export type BaseObjectColumn = z.infer<typeof BaseObjectColumn>

import { z } from "zod"
import { ForeignKey } from "../foreignKey.ts"

export const ForeignKeyError = z.object({
  type: z.literal("foreignKey").describe("Error type identifier"),

  foreignKey: ForeignKey.describe(
    "The foreign key constraint that was violated",
  ),

  cells: z
    .array(z.string())
    .describe("The cells that violate the foreign key constraint"),
})

export type ForeignKeyError = z.infer<typeof ForeignKeyError>

import { z } from "zod"
import { Column } from "../column/Column.ts"
import { ForeignKey } from "./ForeignKey.ts"
import { UniqueKey } from "./UniqueKey.ts"

export const TableSchema = z.object({
  $schema: z
    .string()
    .regex(/table\.json$/)
    .describe("URI to one of the officially published Fairspec Table profiles"),

  required: z
    .array(z.string())
    .optional()
    .describe("An optional list of column names that must be present"),

  properties: z
    .record(z.string(), Column)
    .describe(
      "An object defining the schema for table columns, where each key is a column name",
    ),

  missingValues: z
    .array(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.object({
          value: z.union([z.string(), z.number(), z.boolean()]),
          label: z.string(),
        }),
      ]),
    )
    .optional()
    .describe(
      "An optional list of values that represent missing or null data across all columns",
    ),

  primaryKey: z
    .array(z.string())
    .min(1)
    .optional()
    .describe(
      "An optional array of column names that form the table's primary key",
    ),

  uniqueKeys: z
    .array(UniqueKey)
    .min(1)
    .optional()
    .describe("An optional array of unique key constraints"),

  foreignKeys: z
    .array(ForeignKey)
    .min(1)
    .optional()
    .describe("An optional array of foreign key constraints"),
})

export type TableSchema = z.infer<typeof TableSchema>

import { z } from "zod"

export const FrictionlessDialect = z.object({
  $schema: z
    .string()
    .optional()
    .describe("JSON schema profile URL for validation"),
  name: z.string().optional().describe("The name of this dialect"),
  header: z
    .boolean()
    .optional()
    .describe("Whether the file includes a header row with field names"),
  headerRows: z
    .array(z.number())
    .optional()
    .describe("Row numbers (zero-based) that are considered header rows"),
  headerJoin: z
    .string()
    .optional()
    .describe("The character used to join multi-line headers"),
  commentRows: z
    .array(z.number())
    .optional()
    .describe("Specific rows to be excluded from the data (zero-based)"),
  commentPrefix: z
    .string()
    .optional()
    .describe("Character sequence denoting the start of a comment line"),
  delimiter: z
    .string()
    .optional()
    .describe("The character used to separate fields in the data"),
  lineTerminator: z
    .string()
    .optional()
    .describe("Character sequence used to terminate rows"),
  quoteChar: z.string().optional().describe("Character used to quote fields"),
  doubleQuote: z
    .boolean()
    .optional()
    .describe(
      "Controls whether a sequence of two quote characters represents a single quote",
    ),
  escapeChar: z
    .string()
    .optional()
    .describe("Character used to escape the delimiter or quote characters"),
  nullSequence: z
    .string()
    .optional()
    .describe(
      "Character sequence representing null or missing values in the data",
    ),
  skipInitialSpace: z
    .boolean()
    .optional()
    .describe(
      "Whether to ignore whitespace immediately following the delimiter",
    ),
  property: z
    .string()
    .optional()
    .describe("For JSON data, the property name containing the data array"),
  itemType: z
    .enum(["array", "object"])
    .optional()
    .describe(
      "The type of data item in the source: 'array' for rows represented as arrays, or 'object' for rows represented as objects",
    ),
  itemKeys: z
    .array(z.string())
    .optional()
    .describe(
      "For object-based data items, specifies which object properties to extract as values",
    ),
  sheetNumber: z
    .number()
    .optional()
    .describe("For spreadsheet data, the sheet number to read (zero-based)"),
  sheetName: z
    .string()
    .optional()
    .describe("For spreadsheet data, the sheet name to read"),
  table: z
    .string()
    .optional()
    .describe("For database sources, the table name to read"),
})

export type FrictionlessDialect = z.infer<typeof FrictionlessDialect>

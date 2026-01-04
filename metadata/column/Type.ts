import { z } from "zod"

export const ColumnType = z.enum([
  "array",
  "base64",
  "boolean",
  "date",
  "datetime",
  "duration",
  "email",
  "geojson",
  "hex",
  "integer",
  "list",
  "number",
  "object",
  "string",
  "time",
  "topojson",
  "url",
  "uuid",
  "wkb",
  "wkt",
  "year",
])

export type ColumnType = z.infer<typeof ColumnType>

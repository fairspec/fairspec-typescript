import type { Column } from "@fairspec/metadata"

export const SQLITE_NATIVE_TYPES = [
  "integer",
  "number",
  "string",
] satisfies Column["type"][]

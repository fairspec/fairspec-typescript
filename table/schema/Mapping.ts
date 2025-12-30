import type { Schema } from "@fairspec/metadata"
import type { PolarsSchema } from "./Schema.ts"

export interface SchemaMapping {
  source: PolarsSchema
  target: Schema
}

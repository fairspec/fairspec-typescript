import type { Descriptor } from "../descriptor/index.ts"
import type { JsonSchema } from "./Schema.ts"

export function denormalizeJsonSchema(tableSchema: JsonSchema) {
  tableSchema = globalThis.structuredClone(tableSchema)
  return tableSchema as Descriptor
}

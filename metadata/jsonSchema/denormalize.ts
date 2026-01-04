import type { Descriptor } from "../descriptor/index.ts"
import type { JsonSchema } from "./Schema.ts"

export function denormalizeJsonSchema(jsonSchema: JsonSchema) {
  jsonSchema = globalThis.structuredClone(jsonSchema)
  return jsonSchema as Descriptor
}

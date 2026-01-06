import type { JsonSchema } from "./JsonSchema.ts"

export function denormalizeJsonSchema(jsonSchema: JsonSchema) {
  return globalThis.structuredClone(jsonSchema)
}

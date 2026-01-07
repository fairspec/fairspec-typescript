import { copyDescriptor } from "../descriptor/index.ts"
import type { JsonSchema } from "./JsonSchema.ts"

export function denormalizeJsonSchema(jsonSchema: JsonSchema) {
  return copyDescriptor(jsonSchema)
}

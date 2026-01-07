import type { Descriptor } from "../descriptor/index.ts"
import { inspectJsonSchema } from "./inspect/schema.ts"
import type { JsonSchema } from "./JsonSchema.ts"

export async function assertJsonSchema(descriptor: Descriptor) {
  const errors = await inspectJsonSchema(descriptor)

  // TODO: Improve consolidated error message
  if (errors.length) {
    throw new Error(
      `JsonSchema "${JSON.stringify(descriptor).slice(0, 100)}" is not valid`,
    )
  }

  // Valid -> we can cast it
  return descriptor as JsonSchema
}

import { saveDescriptor } from "../descriptor/index.ts"
import { denormalizeJsonSchema } from "./denormalize.ts"
import type { JsonSchema } from "./Schema.ts"

export async function saveJsonSchema(
  jsonSchema: JsonSchema,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  const descriptor = denormalizeJsonSchema(jsonSchema)

  await saveDescriptor(descriptor, {
    path: options.path,
    overwrite: options.overwrite,
  })
}

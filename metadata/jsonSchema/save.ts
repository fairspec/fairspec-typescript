import { saveDescriptor } from "../descriptor/index.ts"
import type { JsonSchema } from "./Schema.ts"

export async function saveJsonSchema(
  jsonSchema: JsonSchema,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  await saveDescriptor(jsonSchema, {
    path: options.path,
    overwrite: options.overwrite,
  })
}

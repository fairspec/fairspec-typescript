import { saveDescriptor } from "../descriptor/index.ts"
import { convertTableSchemaToDescriptor } from "./convert/toDescriptor.ts"
import type { Schema } from "./Schema.ts"

const CURRENT_PROFILE = "https://datapackage.org/profiles/2.0/tableschema.json"

/**
 * Save a Schema to a file path
 * Works in Node.js environments
 */
export async function saveTableSchema(
  schema: Schema,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  const descriptor = convertTableSchemaToDescriptor(schema)
  descriptor.$schema = descriptor.$schema ?? CURRENT_PROFILE

  await saveDescriptor(descriptor, {
    path: options.path,
    overwrite: options.overwrite,
  })
}

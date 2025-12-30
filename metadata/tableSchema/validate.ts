import type { Descriptor } from "../descriptor/index.ts"
import { loadDescriptor } from "../descriptor/index.ts"
import { validateDescriptor } from "../profile/index.ts"
import { convertTableSchemaFromDescriptor } from "./convert/fromDescriptor.ts"
import type { Schema } from "./Schema.ts"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/tableschema.json"

/**
 * Validate a Schema descriptor (JSON Object) against its profile
 */
export async function validateTableSchema(source: Schema | Descriptor | string) {
  const descriptor =
    typeof source === "string"
      ? await loadDescriptor(source)
      : (source as Descriptor)

  const profile =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const report = await validateDescriptor(descriptor, {
    profile,
  })

  let schema: Schema | undefined
  if (report.valid) {
    // Validation + normalization = we can cast it
    schema = convertTableSchemaFromDescriptor(descriptor) as unknown as Schema
  }

  return { ...report, schema }
}

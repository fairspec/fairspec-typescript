import type { Descriptor } from "../descriptor/index.ts"
import { loadDescriptor } from "../descriptor/index.ts"
import { validateDialect } from "../dialect/index.ts"
import type { MetadataError } from "../error/index.ts"
import { validateDescriptor } from "../profile/index.ts"
import { validateTableSchema } from "../tableSchema/index.ts"
import { convertResourceFromDescriptor } from "./convert/fromDescriptor.ts"
import type { Resource } from "./Resource.ts"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/dataresource.json"

/**
 * Validate a Resource descriptor (JSON Object) against its profile
 */
export async function validateResourceMetadata(
  source: Resource | Descriptor | string,
  options?: {
    basepath?: string
  },
) {
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

  let resource: Resource | undefined
  if (report.valid) {
    // Validation + normalization = we can cast it
    resource = convertResourceFromDescriptor(descriptor, {
      basepath: options?.basepath,
    }) as unknown as Resource
  }

  if (resource) {
    const dialectErorrs = await inspectDialectIfExternal(resource)
    report.errors.push(...dialectErorrs)

    const schemaErorrs = await inspectSchemaIfExternal(resource)
    report.errors.push(...schemaErorrs)

    // TODO: Support external JSON Schema validation as well

    if (report.errors.length) {
      resource = undefined
      report.valid = false
    }
  }

  return { ...report, resource }
}

async function inspectDialectIfExternal(resource: Resource) {
  const errors: MetadataError[] = []

  if (typeof resource.dialect === "string") {
    const report = await validateDialect(resource.dialect)
    errors.push(...report.errors)
  }

  return errors
}

async function inspectSchemaIfExternal(resource: Resource) {
  const errors: MetadataError[] = []

  if (typeof resource.schema === "string") {
    const report = await validateTableSchema(resource.schema)
    errors.push(...report.errors)
  }

  return errors
}

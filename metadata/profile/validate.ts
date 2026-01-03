import type { Descriptor } from "../descriptor/index.ts"
import type { MetadataError } from "../error/index.ts"
import { inspectJsonValue } from "../jsonSchema/index.ts"
import { createReport } from "../report/index.ts"
import { loadProfile } from "./load.ts"
import type { ProfileType } from "./Profile.ts"

export async function validateDescriptor(
  descriptor: Descriptor,
  options?: {
    type?: ProfileType
  },
) {
  const $schema =
    typeof descriptor.$schema === "string" ? descriptor.$schema : undefined

  if (!$schema) {
    return createReport<MetadataError>([
      {
        type: "metadata",
        message: "Must have required property $schema at /",
        jsonPointer: "$schema",
      },
    ])
  }

  const profile = await loadProfile($schema, options)
  const errors = await inspectJsonValue(descriptor, { jsonSchema: profile })

  return createReport<MetadataError>(
    errors.map(error => ({
      type: "metadata",
      ...error,
    })),
  )
}

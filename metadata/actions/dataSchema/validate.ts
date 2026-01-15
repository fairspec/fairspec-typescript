import { loadDescriptor } from "../../actions/descriptor/load.ts"
import { inspectJsonSchema } from "../../actions/jsonSchema/inspect.ts"
import { createReport } from "../../actions/report/create.ts"
import type { DataSchema } from "../../models/dataSchema.ts"
import type { Descriptor } from "../../models/descriptor.ts"

export async function validateDataSchema(
  source: DataSchema | Descriptor | string,
  options?: {
    rootJsonPointer?: string
  },
) {
  const descriptor =
    typeof source === "string"
      ? await loadDescriptor(source)
      : (source as Descriptor)

  const errors = await inspectJsonSchema(descriptor, {
    rootJsonPointer: options?.rootJsonPointer,
  })

  const report = createReport(
    errors.map(error => {
      return {
        type: "metadata",
        ...error,
      }
    }),
  )

  let dataSchema: DataSchema | undefined
  if (report.valid) {
    // Valid -> we can cast it
    dataSchema = descriptor as DataSchema
  }

  return { ...report, dataSchema }
}

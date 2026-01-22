import type { DataSchema } from "../../models/dataSchema.ts"
import type { Descriptor } from "../../models/descriptor.ts"
import { validateDataSchema } from "./validate.ts"

export async function assertDataSchema(source: Descriptor | DataSchema) {
  const report = await validateDataSchema(source)

  if (!report.dataSchema) {
    throw new Error(
      `Dialect "${JSON.stringify(source).slice(0, 100)}" is not valid`,
    )
  }

  return report.dataSchema
}

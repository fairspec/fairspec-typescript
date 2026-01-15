import type { GeneralError, Resource } from "@fairspec/metadata"
import {
  createReport,
  inspectJson,
  resolveDataSchema,
} from "@fairspec/metadata"
import { loadData } from "./load.ts"

export async function validateData(resource: Partial<Resource>) {
  const errors: GeneralError[] = []

  const dataSchema = await resolveDataSchema(resource.dataSchema)
  if (dataSchema) {
    const data = await loadData(resource)

    if (data) {
      const dataErrors = await inspectJson(data, { jsonSchema: dataSchema })
      errors.push(
        ...dataErrors.map(error => ({
          type: "data",
          ...error,
        })),
      )
    }

    if (!data) {
      errors.push({
        type: "resource",
        expectedDataType: "data",
      })
    }
  }

  return createReport(errors)
}

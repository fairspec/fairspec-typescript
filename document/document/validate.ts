import type { DataError, JsonDocumentError, Resource } from "@fairspec/metadata"
import {
  createReport,
  inspectJsonValue,
  resolveJsonSchema,
} from "@fairspec/metadata"

export async function validateDocument(resource: Partial<Resource>) {
  if (resource.jsonSchema) {
    const jsonSchema = await resolveJsonSchema(resource.jsonSchema)

    if (!resource.data) {
      return createReport<DataError>([
        {
          type: "data",
          message: `missing ${resource.name} data`,
        },
      ])
    }

    if (jsonSchema) {
      const errors = await inspectJsonValue(resource.data, { jsonSchema })

      return createReport<JsonDocumentError>(
        errors.map(error => ({
          type: "document/json",
          ...error,
        })),
      )
    }
  }

  return createReport()
}

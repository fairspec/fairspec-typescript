import type { JsonSchema } from "../../../models/jsonSchema.ts"
import { ajv } from "../ajv.ts"
import { loadJsonSchema } from "../load.ts"

/**
 * Validate a value against a JSON Schema
 * It uses Ajv for JSON Schema validation under the hood
 */
export async function inspectJsonValue(
  value: unknown,
  options: {
    jsonSchema: JsonSchema | string
    rootJsonPointer?: string
  },
) {
  const jsonSchema =
    typeof options.jsonSchema === "string"
      ? await loadJsonSchema(options.jsonSchema)
      : options.jsonSchema

  const validate = await ajv.compileAsync(jsonSchema)
  validate(value)

  const errors = validate.errors
    ? validate.errors?.map(error => {
        const instancePath = error.instancePath ?? "/"
        const rootPath = options.rootJsonPointer ?? ""
        const jsonPointer =
          rootPath === "" || rootPath === "/"
            ? instancePath
            : instancePath === "/"
              ? rootPath
              : `${rootPath}${instancePath}`

        return {
          message: error.message ?? "error",
          jsonPointer,
        }
      })
    : []

  return errors
}

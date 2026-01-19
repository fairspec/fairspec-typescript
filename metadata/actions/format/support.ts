import type { Format } from "../../models/format/format.ts"
import type { Resource } from "../../models/resource.ts"
import { inferFormatName } from "./infer.ts"

export function getSupportedFormat(
  resource: Resource,
  names: Format["name"][],
): Format | undefined {
  const format = resource.format

  if (format) {
    return names.includes(format.name) ? format : undefined
  }

  const name = inferFormatName(resource)
  return names.includes(name) ? { name } : undefined
}

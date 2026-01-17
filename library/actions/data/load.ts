import type { Resource } from "@fairspec/metadata"
import { getSupportedFormat, getDataFirstPath, getDataValue } from "@fairspec/metadata"
import { loadDescriptor } from "@fairspec/metadata"

export async function loadData(
  resource: Partial<Resource>,
) {
  const dataValue = getDataValue(resource)
  if (dataValue) return dataValue

  const firstPath = getDataFirstPath(resource)
  if (firstPath) {
    const format = getSupportedFormat(resource, ['json'])
    if (format) {
      return await loadDescriptor(firstPath)
    }
  }

  return undefined
}

import type { Resource } from "@fairspec/metadata"
import { getFileExtension, getDataFirstPath, getDataValue } from "@fairspec/metadata"
import { loadDescriptor } from "@fairspec/metadata"

export async function loadData(
  resource: Partial<Resource>,
) {
  const dataValue = getDataValue(resource)
  if (dataValue) return dataValue

  const firstPath = getDataFirstPath(resource)
  if (firstPath) {
    const format = resource.format
    const extension = getFileExtension(firstPath)

    if (format?.type === 'json' || extension === 'json') {
      return await loadDescriptor(firstPath)
    }
  }

  return undefined
}

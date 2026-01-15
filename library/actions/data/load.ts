import type { Resource } from "@fairspec/metadata"
import { getFileExtension, getFirstDataPath, getJsonData } from "@fairspec/metadata"
import { loadDescriptor } from "@fairspec/metadata"

export async function loadData(
  resource: Partial<Resource>,
) {
  const jsonData = getJsonData(resource)
  if (jsonData) return jsonData

  const firstPath = getFirstDataPath(resource)
  if (firstPath) {
    const format = resource.format
    const extension = getFileExtension(firstPath)

    if (format?.type === 'json' || extension === 'json') {
      return await loadDescriptor(firstPath)
    }
  }

  return undefined
}

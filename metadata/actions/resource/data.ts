import type { ResourceDataValue } from "../../models/data.ts"
import type { Resource } from "../../models/resource.ts"

export function getDataPath(resource: Partial<Resource>) {
  if (typeof resource.data === "string") {
    return resource.data
  }

  if (Array.isArray(resource.data)) {
    if (resource.data.every(item => typeof item === "string")) {
      return resource.data
    }
  }

  return undefined
}

export function getDataValue(resource: Partial<Resource>) {
  const dataPath = getDataPath(resource)

  if (!dataPath) {
    // TODO: dont cast
    return resource.data as ResourceDataValue
  }

  return undefined
}

export function getDataRecords(resource: Partial<Resource>) {
  const dataValue = getDataValue(resource)
  if (!dataValue) return undefined

  return Array.isArray(dataValue) ? dataValue : undefined
}

export function getDataPaths(resource: Partial<Resource>) {
  const dataPath = getDataPath(resource)
  if (!dataPath) return []
  return Array.isArray(dataPath) ? dataPath : [dataPath]
}

export function getDataFirstPath(resource: Partial<Resource>) {
  const dataPath = getDataPath(resource)
  if (!dataPath) return undefined
  return Array.isArray(dataPath) ? dataPath[0] : dataPath
}

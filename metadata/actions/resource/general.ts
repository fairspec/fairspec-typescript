import { isRemotePath } from "../../actions/path/general.ts"
import type { JsonData } from "../../models/data.ts"
import type { Resource } from "../../models/resource.ts"

export function isRemoteResource(resource: Partial<Resource>) {
  const pathData = getPathData(resource)
  if (!pathData) return false

  const paths = Array.isArray(pathData) ? pathData : [pathData]
  return paths?.some(path => isRemotePath(path))
}

export function getPathData(resource: Partial<Resource>) {
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

export function getJsonData(resource: Partial<Resource>) {
  const pathData = getPathData(resource)

  if (!pathData) {
    // TODO: dont cast
    return resource.data as JsonData
  }

  return undefined
}

export function getTableData(resource: Partial<Resource>) {
  const jsonData = getJsonData(resource)
  if (!jsonData) return undefined

  return Array.isArray(jsonData) ? jsonData : undefined
}

export function getDataPaths(resource: Partial<Resource>) {
  const pathData = getPathData(resource)
  if (!pathData) return []
  return Array.isArray(pathData) ? pathData : [pathData]
}

export function getFirstDataPath(resource: Partial<Resource>) {
  const pathData = getPathData(resource)
  if (!pathData) return undefined
  return Array.isArray(pathData) ? pathData[0] : pathData
}

import { isRemotePath } from "../path/index.ts"
import type { Resource } from "./Resource.ts"

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
    return resource.data
  }

  return undefined
}

export function getPaths(resource: Partial<Resource>) {
  const pathData = getPathData(resource)
  if (!pathData) return []
  return Array.isArray(pathData) ? pathData : [pathData]
}

export function getFirstPath(resource: Partial<Resource>) {
  const pathData = getPathData(resource)
  if (!pathData) return undefined
  return Array.isArray(pathData) ? pathData[0] : pathData
}

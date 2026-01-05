import { isRemotePath } from "../path/index.ts"
import type { Resource } from "./Resource.ts"

export function isRemoteResource(resource: Resource) {
  const pathData = getPathData(resource)
  if (!pathData) return false

  const paths = Array.isArray(pathData) ? pathData : [pathData]
  return paths?.some(path => isRemotePath(path))
}

export function getPathData(resource: Resource) {
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

export function getJsonData(resource: Resource) {
  const pathData = getPathData(resource)

  if (!pathData) {
    return resource.data
  }

  return undefined
}

import { getFileNameSlug } from "../path/index.ts"
import { getFirstDataPath } from "./general.ts"
import type { Resource } from "./Resource.ts"

export function inferResourceName(resource: Partial<Resource>) {
  const path = getFirstDataPath(resource)

  if (path) {
    const name = getFileNameSlug(path)
    if (name) return name
  }

  return "resource"
}

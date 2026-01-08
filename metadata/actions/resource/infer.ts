import { getFileNameSlug } from "../../actions/path/general.ts"
import type { Resource } from "../../models/resource.ts"
import { getFirstDataPath } from "./general.ts"

export function inferResourceName(resource: Partial<Resource>) {
  const path = getFirstDataPath(resource)

  if (path) {
    const name = getFileNameSlug(path)
    if (name) return name
  }

  return "resource"
}

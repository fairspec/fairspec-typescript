import { getFileNameSlug } from "../../actions/path/general.ts"
import type { Resource } from "../../models/resource.ts"
import { getDataFirstPath } from "./data.ts"

export function inferResourceName(resource: Resource) {
  const firstPath = getDataFirstPath(resource)

  if (firstPath) {
    const name = getFileNameSlug(firstPath)
    if (name) return name
  }

  return "resource"
}

import {
  getFileNameSlug,
  getFormatName,
  getProtocolName,
} from "../path/index.ts"
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

export function inferFormatName(resource: Partial<Resource>) {
  const path = getFirstDataPath(resource)

  if (path) {
    const protocol = getProtocolName(path)

    // TODO: review
    if (DATABASE_PROTOCOLS.includes(protocol)) {
      return protocol
    } else {
      const formatName = getFormatName(path)
      return formatName
    }
  }

  return undefined
}

const DATABASE_PROTOCOLS = ["postgresql", "mysql", "sqlite"]

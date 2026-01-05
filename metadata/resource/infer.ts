import {
  getFileName,
  getFormatName,
  getName,
  getProtocol,
} from "../path/index.ts"
import { getFirstPath } from "./general.ts"
import type { Resource } from "./Resource.ts"

export function inferName(resource: Partial<Resource>) {
  let name = resource.name

  if (!name) {
    const path = getFirstPath(resource)
    if (path) {
      const fileName = getFileName(path)
      name = getName(fileName)
    }
  }

  return name ?? "resource"
}

export function inferFormatName(resource: Partial<Resource>) {
  const format = resource.format
  if (format) {
    return format.name
  }

  const path = getFirstPath(resource)
  if (path) {
    const protocol = getProtocol(path)

    // TODO: review
    if (DATABASE_PROTOCOLS.includes(protocol)) {
      return protocol
    } else {
      const fileName = getFileName(path)
      const formatName = getFormatName(fileName)
      return formatName
    }
  }

  return undefined
}

const DATABASE_PROTOCOLS = ["postgresql", "mysql", "sqlite"]

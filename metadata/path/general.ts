import slugify from "@sindresorhus/slugify"
import { node } from "../platform/index.ts"

export function isRemotePath(path: string) {
  const protocolName = getProtocolName(path)
  return protocolName !== "file"
}

export function getFileNameSlug(path: string) {
  const fileName = getFileName(path)
  if (!fileName) {
    return undefined
  }

  const basename = fileName.split(".")[0]
  if (!basename) {
    return undefined
  }

  return slugify(basename, { separator: "_" })
}

export function getProtocolName(path: string) {
  try {
    const url = new URL(path)
    const protocolName = url.protocol.replace(":", "")

    // Handle Windows drive letters
    if (protocolName.length < 2) {
      return "file"
    }

    return protocolName
  } catch {
    return "file"
  }
}

export function getFormatName(path: string) {
  const fileName = getFileName(path)
  return fileName?.split(".").slice(-1)[0]?.toLowerCase()
}

export function getFileName(path: string) {
  const isRemote = isRemotePath(path)

  if (isRemote) {
    const pathname = new URL(path).pathname
    const fileName = pathname.split("/").slice(-1)[0]
    return fileName?.includes(".") ? fileName : undefined
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const resolvedPath = node.path.resolve(path)
  const fileName = node.path.parse(resolvedPath).base
  return fileName?.includes(".") ? fileName : undefined
}

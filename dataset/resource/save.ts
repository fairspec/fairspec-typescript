import type { Resource } from "@fairspec/metadata"
import {
  copyDescriptor,
  denormalizePath,
  getFileName,
  isRemotePath,
} from "@fairspec/metadata"

export type SaveFile = (options: {
  propertyName: string
  propertyIndex: number
  normalizedPath: string
  denormalizedPath: string
}) => Promise<string>

export async function saveResourceFiles(
  resource: Resource,
  options: {
    saveFile: SaveFile
    basepath?: string
    withRemote?: boolean
    withoutFolders?: boolean
  },
) {
  const { basepath, withRemote, withoutFolders } = options

  const targetResource = copyDescriptor(resource)
  const dedupIndexes = new Map<string, number>()

  const saveFile = async (path: string, name: string, index: number) => {
    const isRemote = isRemotePath(path)

    // Denormalized path always uses "/" as the path separator
    let denormalizedPath = denormalizePath(path, { basepath })
    const normalizedPath = path

    if (isRemote) {
      if (!withRemote) return path
      const filename = getFileName(path)
      if (!filename) return path
      denormalizedPath = filename
    } else if (withoutFolders) {
      denormalizedPath = denormalizedPath.replaceAll("/", "-")
    }

    const dedupIndex = dedupIndexes.get(denormalizedPath) ?? 0
    dedupIndexes.set(denormalizedPath, dedupIndex + 1)

    if (dedupIndex) {
      denormalizedPath = denormalizedPath.replace(
        /^(.*?)([^/]+?)(\.[^/]+(?:\.[^/]+)*)$/,
        `$1$2-${dedupIndex}$3`,
      )
    }

    denormalizedPath = await options.saveFile({
      propertyName: name,
      propertyIndex: index,
      normalizedPath,
      denormalizedPath,
    })

    return denormalizedPath
  }

  if (typeof targetResource.data === "string") {
    targetResource.data = await saveFile(targetResource.data, "data", 0)
  }

  if (Array.isArray(targetResource.data)) {
    for (const [index, item] of targetResource.data.entries()) {
      if (typeof item === "string") {
        targetResource.data[index] = await saveFile(item, "data", index)
      }
    }
  }

  for (const name of ["jsonSchema", "tableSchema"] as const) {
    const property = resource[name]
    if (typeof property === "string") {
      targetResource[name] = await saveFile(property, name, 0)
    }
  }

  return targetResource
}

import os from "node:os"
import type { Resource } from "@fairspec/metadata"
import { getPaths, isRemotePath } from "@fairspec/metadata"
import pAll from "p-all"
import { copyFile, getTempFilePath } from "../file/index.ts"

export async function prefetchFiles(resource: Partial<Resource>) {
  const paths = getPaths(resource)
  if (!paths.length) return []

  const concurrency = os.cpus().length
  const newPaths = await pAll(
    paths.map(path => () => prefetchFile(path)),
    { concurrency },
  )

  return newPaths
}

export async function prefetchFile(path: string) {
  if (!isRemotePath(path)) return path
  const newPath = getTempFilePath()
  await copyFile({ sourcePath: path, targetPath: newPath })
  return newPath
}

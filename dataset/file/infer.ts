import { stat } from "node:fs/promises"
import type { Resource } from "@fairspec/metadata"
import { getFirstPath } from "@fairspec/metadata"
import chardet from "chardet"
import * as hasha from "hasha"
import { isBinaryFile } from "isbinaryfile"
import pMap from "p-map"
import { loadFile } from "../file/index.ts"
import { concatFileStreams } from "../stream/concat.ts"
import { loadFileStream } from "../stream/index.ts"
import { prefetchFiles } from "./fetch.ts"

export type HashType = NonNullable<Resource["integrity"]>["type"]

export async function inferBytes(resource: Partial<Resource>) {
  const localPaths = await prefetchFiles(resource)

  let bytes = 0
  for (const localPath of localPaths) {
    const result = await stat(localPath)
    bytes += result.size
  }

  return bytes
}

export async function inferHash(
  resource: Partial<Resource>,
  options?: { hashType?: HashType },
) {
  const algorithm = options?.hashType ?? "sha256"
  const localPaths = await prefetchFiles(resource)

  const streams = await pMap(localPaths, async path => loadFileStream(path))
  const stream = concatFileStreams(streams)

  const hash = await hasha.hash(stream, { algorithm })
  return `${algorithm}:${hash}`
}

export async function inferEncoding(
  resource: Partial<Resource>,
  options?: { sampleBytes?: number; confidencePercent?: number },
) {
  const maxBytes = options?.sampleBytes ?? 10_000
  const confidencePercent = options?.confidencePercent ?? 80

  const firstPath = getFirstPath(resource)
  if (!firstPath) {
    return undefined
  }

  const buffer = await loadFile(firstPath, { maxBytes })
  const isBinary = await isBinaryFile(buffer)

  if (!isBinary) {
    const matches = chardet.analyse(buffer)
    for (const match of matches) {
      if (match.confidence >= confidencePercent) {
        return match.name.toLowerCase()
      }
    }
  }

  return undefined
}

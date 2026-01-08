import { prefetchFile } from "./fetch.ts"
import type { HashType } from "./infer.ts"
import { inferBytes, inferHash } from "./infer.ts"

export async function describeFile(
  path: string,
  options?: { hashType?: HashType },
) {
  const localPath = await prefetchFile(path)

  const bytes = await inferBytes({ data: localPath })
  const hash = await inferHash(
    { data: localPath },
    { hashType: options?.hashType },
  )

  return { bytes, hash }
}

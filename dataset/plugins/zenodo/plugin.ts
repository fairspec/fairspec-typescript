import { isRemotePath } from "@fairspec/metadata"
import type { DatasetPlugin } from "../../plugin.ts"
import { loadDatasetFromZenodo } from "./dataset/load.ts"

export class ZenodoPlugin implements DatasetPlugin {
  async loadDataset(source: string) {
    const isZenodo = getIsZenodo(source)
    if (!isZenodo) return undefined

    const dataset = await loadDatasetFromZenodo(source)
    return dataset
  }
}

function getIsZenodo(path: string) {
  const isRemote = isRemotePath(path)
  if (!isRemote) return false

  return new URL(path).hostname.endsWith("zenodo.org")
}

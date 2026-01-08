import { isRemotePath } from "@fairspec/metadata"
import type { DatasetPlugin } from "../../plugin.ts"
import { loadDatasetFromCkan } from "./dataset/load.ts"

export class CkanPlugin implements DatasetPlugin {
  async loadDataset(source: string) {
    const isCkan = getIsCkan(source)
    if (!isCkan) return undefined

    const dataset = await loadDatasetFromCkan(source)
    return dataset
  }
}

function getIsCkan(path: string) {
  const isRemote = isRemotePath(path)
  if (!isRemote) return false

  return path.includes("/dataset/")
}

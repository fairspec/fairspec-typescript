import { stat } from "node:fs/promises"
import type { Dataset } from "@fairspec/metadata"
import { isRemotePath } from "@fairspec/metadata"
import type { DatasetPlugin } from "../../plugin.ts"
import { loadDatasetFromFolder } from "./actions/dataset/load.ts"
import { saveDatasetToFolder } from "./actions/dataset/save.ts"

export class FolderPlugin implements DatasetPlugin {
  async loadDataset(source: string) {
    const isFolder = await getIsFolder(source)
    if (!isFolder) return undefined

    const dataset = await loadDatasetFromFolder(source)
    return dataset
  }

  async saveDataset(
    dataset: Dataset,
    options: { target: string; withRemote?: boolean },
  ) {
    const isFolder = await getIsFolder(options.target)
    if (!isFolder) return undefined

    await saveDatasetToFolder(dataset, {
      folderPath: options.target,
      withRemote: options.withRemote,
    })

    return { path: options.target }
  }
}

async function getIsFolder(path: string) {
  const isRemote = isRemotePath(path)
  if (isRemote) return false

  try {
    return (await stat(path)).isDirectory()
  } catch {
    return false
  }
}

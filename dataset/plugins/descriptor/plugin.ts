import type { Dataset } from "@fairspec/metadata"
import {
  inferFormatName,
  isRemotePath,
  loadDatasetDescriptor,
  saveDatasetDescriptor,
} from "@fairspec/metadata"
import type { DatasetPlugin } from "../../plugin.ts"

export class DescriptorPlugin implements DatasetPlugin {
  async loadDataset(source: string) {
    const isLocalJson = await getIsLocalJson(source)
    if (!isLocalJson) return undefined

    const dataset = await loadDatasetDescriptor(source)
    return dataset
  }

  async saveDataset(
    dataset: Dataset,
    options: { target: string; withRemote?: boolean },
  ) {
    const isLocalJson = await getIsLocalJson(options.target)
    if (!isLocalJson) return undefined

    if (!options.target.endsWith("datapackage.json")) {
      return undefined
    }

    await saveDatasetDescriptor(dataset, { path: options.target })

    return { path: options.target }
  }
}

async function getIsLocalJson(path: string) {
  const isRemote = isRemotePath(path)
  const format = inferFormatName({ data: path })
  return !isRemote && format === "json"
}

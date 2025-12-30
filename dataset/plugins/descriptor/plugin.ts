import type { Package } from "@fairspec/metadata"
import {
  inferFormat,
  isRemotePath,
  loadPackageDescriptor,
  savePackageDescriptor,
} from "@fairspec/metadata"
import type { DatasetPlugin } from "../../plugin.ts"

export class DescriptorPlugin implements DatasetPlugin {
  async loadPackage(source: string) {
    const isLocalJson = await getIsLocalJson(source)
    if (!isLocalJson) return undefined

    const dataPackage = await loadPackageDescriptor(source)
    return dataPackage
  }

  async savePackage(
    dataPackage: Package,
    options: { target: string; withRemote?: boolean },
  ) {
    const isLocalJson = await getIsLocalJson(options.target)
    if (!isLocalJson) return undefined

    if (!options.target.endsWith("datapackage.json")) {
      return undefined
    }

    await savePackageDescriptor(dataPackage, { path: options.target })

    return { path: options.target }
  }
}

async function getIsLocalJson(path: string) {
  const isRemote = isRemotePath(path)
  const format = inferFormat({ path })
  return !isRemote && format === "json"
}

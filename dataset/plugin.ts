import type { Package } from "@fairspec/metadata"

export type SavePackageOptions = {
  target: string
  withRemote?: boolean
}

export interface DatasetPlugin {
  loadPackage?(source: string): Promise<Package | undefined>

  savePackage?(
    dataPackage: Package,
    options: SavePackageOptions,
  ): Promise<{ path?: string } | undefined>
}

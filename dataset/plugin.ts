import type { Dataset, MetadataPlugin } from "@fairspec/metadata"

export type SaveDatasetOptions = {
  target: string
  withRemote?: boolean
}

export interface DatasetPlugin extends MetadataPlugin {
  loadDataset?(source: string): Promise<Dataset | undefined>

  saveDataset?(
    dataset: Dataset,
    options: SaveDatasetOptions,
  ): Promise<{ path?: string } | undefined>
}

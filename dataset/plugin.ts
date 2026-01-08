import type { Dataset } from "@fairspec/metadata"

export type SaveDatasetOptions = {
  target: string
  withRemote?: boolean
}

export interface DatasetPlugin {
  loadDataset?(source: string): Promise<Dataset | undefined>

  saveDataset?(
    dataset: Dataset,
    options: SaveDatasetOptions,
  ): Promise<{ path?: string } | undefined>
}

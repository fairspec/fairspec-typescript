import type {
  Dataset,
  Format,
  MetadataPlugin,
  Resource,
} from "@fairspec/metadata"

export type SaveDatasetOptions = {
  target: string
  withRemote?: boolean
}

export type InferFormatOptions = {
  sampleBytes?: number
}

export interface DatasetPlugin extends MetadataPlugin {
  loadDataset?(source: string): Promise<Dataset | undefined>

  saveDataset?(
    dataset: Dataset,
    options: SaveDatasetOptions,
  ): Promise<{ path?: string } | undefined>

  inferFormat?(
    resource: Resource,
    options?: InferFormatOptions,
  ): Promise<Format | undefined>
}

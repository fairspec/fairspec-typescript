import type {
  Dataset,
  Dialect,
  MetadataPlugin,
  Resource,
} from "@fairspec/metadata"

export type SaveDatasetOptions = {
  target: string
  withRemote?: boolean
}

export type InferDialectOptions = {
  sampleBytes?: number
}

export interface DatasetPlugin extends MetadataPlugin {
  loadDataset?(source: string): Promise<Dataset | undefined>

  saveDataset?(
    dataset: Dataset,
    options: SaveDatasetOptions,
  ): Promise<{ path?: string } | undefined>

  inferDialect?(
    resource: Resource,
    options?: InferDialectOptions,
  ): Promise<Dialect | undefined>
}

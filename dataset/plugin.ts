import type {
  Dataset,
  Dialect,
  MetadataPlugin,
  Resource,
} from "@fairspec/metadata"
import type { SaveDatasetOptions } from "./models/dataset.ts"
import type { InferDialectOptions } from "./models/dialect.ts"

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

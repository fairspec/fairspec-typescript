import type { DatasetPlugin, SaveDatasetOptions } from "@fairspec/dataset"
import type { Dataset, Resource, TableSchema } from "@fairspec/metadata"
import type { InferTableSchemaOptions } from "./models/schema.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  Table,
} from "./models/table.ts"

export interface TablePlugin extends DatasetPlugin {
  saveDataset?(
    dataset: Dataset,
    options: SaveDatasetOptions & { plugins?: TablePlugin[] },
  ): Promise<{ path?: string } | undefined>

  loadTable?(
    resource: Resource,
    options?: LoadTableOptions,
  ): Promise<Table | undefined>

  saveTable?(
    table: Table,
    options: SaveTableOptions,
  ): Promise<string | undefined>

  inferTableSchema?(
    resource: Resource,
    options?: InferTableSchemaOptions,
  ): Promise<TableSchema | undefined>
}

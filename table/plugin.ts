import type {
  DatasetPlugin,
  InferDialectOptions,
  SaveDatasetOptions,
} from "@fairspec/dataset"
import type {
  Dataset,
  Dialect,
  Resource,
  TableSchema,
} from "@fairspec/metadata"
import type {
  InferTableSchemaOptions,
  TableSchemaOptions,
} from "./models/schema.ts"
import type { Table } from "./models/table.ts"

export type LoadTableOptions = InferDialectOptions &
  InferTableSchemaOptions & {
    previewBytes?: number
    denormalized?: boolean
  }

export type SaveTableOptions = TableSchemaOptions & {
  path: string
  dialect?: Dialect
  tableSchema?: TableSchema
  overwrite?: boolean
}

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

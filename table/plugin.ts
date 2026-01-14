import type {
  DatasetPlugin,
  InferFormatOptions,
  SaveDatasetOptions,
} from "@fairspec/dataset"
import type { Dataset, Format, Resource, TableSchema } from "@fairspec/metadata"
import type {
  InferTableSchemaOptions,
  TableSchemaOptions,
} from "./models/schema.ts"
import type { Table } from "./models/table.ts"

export type LoadTableOptions = InferFormatOptions &
  InferTableSchemaOptions & {
    denormalized?: boolean
  }

export type SaveTableOptions = TableSchemaOptions & {
  path: string
  format?: Format
  tableSchema?: TableSchema
  overwrite?: boolean
}

export interface TablePlugin extends DatasetPlugin {
  saveDataset?(
    dataset: Dataset,
    options: SaveDatasetOptions & { plugins?: TablePlugin[] },
  ): Promise<{ path?: string } | undefined>

  loadTable?(
    resource: Partial<Resource>,
    options?: LoadTableOptions,
  ): Promise<Table | undefined>

  saveTable?(
    table: Table,
    options: SaveTableOptions,
  ): Promise<string | undefined>

  inferTableSchema?(
    resource: Partial<Resource>,
    options?: InferTableSchemaOptions,
  ): Promise<TableSchema | undefined>
}

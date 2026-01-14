import type { DatasetPlugin, SaveDatasetOptions } from "@fairspec/dataset"
import type { Dataset, Format, Resource, TableSchema } from "@fairspec/metadata"
import type { FormatOptions, InferFormatOptions } from "./models/format.ts"
import type {
  InferTableSchemaOptions,
  TableSchemaOptions,
} from "./models/schema.ts"
import type { Table } from "./models/table.ts"

export type LoadTableOptions = InferFormatOptions &
  InferTableSchemaOptions & {
    denormalized?: boolean
  }

export type SaveTableOptions = FormatOptions &
  TableSchemaOptions & {
    path: string
    format?: Format
    tableSchema?: TableSchema
    overwrite?: boolean
  }

export interface TablePlugin extends DatasetPlugin {
  savePackage?(
    dataset: Dataset,
    options: SaveDatasetOptions & { plugins?: TablePlugin[] },
  ): Promise<{ path?: string } | undefined>

  inferFormat?(
    resource: Partial<Resource>,
    options?: InferFormatOptions,
  ): Promise<Format | undefined>

  inferTableSchema?(
    resource: Partial<Resource>,
    options?: InferTableSchemaOptions,
  ): Promise<TableSchema | undefined>

  loadTable?(
    resource: Partial<Resource>,
    options?: LoadTableOptions,
  ): Promise<Table | undefined>

  saveTable?(
    table: Table,
    options: SaveTableOptions,
  ): Promise<string | undefined>
}

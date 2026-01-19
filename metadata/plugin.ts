import type { DataSchema } from "./models/dataSchema.ts"
import type { Dataset } from "./models/dataset.ts"
import type { Descriptor } from "./models/descriptor.ts"
import type { TableSchema } from "./models/tableSchema.ts"

export interface MetadataPlugin {
  renderDatasetAs?(
    dataset: Dataset,
    options: { format: string },
  ): string | undefined

  convertDatasetTo?(
    dataset: Dataset,
    options: { format: string },
  ): Descriptor | undefined

  convertDatasetFrom?(
    descriptor: Descriptor,
    options: { format: string },
  ): Dataset | undefined

  renderDataSchemaAs?(
    dataSchema: DataSchema,
    options: { format: string },
  ): string | undefined

  renderTableSchemaAs?(
    tableSchema: TableSchema,
    options: { format: string },
  ): string | undefined

  convertTableSchemaTo?(
    tableSchema: TableSchema,
    options: { format: string },
  ): Descriptor | undefined

  convertTableSchemaFrom?(
    descriptor: Descriptor,
    options: { format: string },
  ): TableSchema | undefined
}

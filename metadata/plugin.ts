import type { Dataset } from "./models/dataset.ts"
import type { Descriptor } from "./models/descriptor.ts"
import type { TableSchema } from "./models/tableSchema.ts"

export interface MetadataPlugin {
  convertDatasetTo?(dataset: Dataset, options: { format: string }): Descriptor

  convertDatasetFrom?(
    descriptor: Descriptor,
    options: { format: string },
  ): Dataset | undefined

  convertTableSchemaTo?(
    tableSchema: TableSchema,
    options: { format: string },
  ): Descriptor
  convertTableSchemaFrom?(
    descriptor: Descriptor,
    options: { format: string },
  ): TableSchema | undefined
}

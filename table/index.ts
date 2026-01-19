export { denormalizeTable } from "./actions/table/denormalize.ts"
export { inspectTable } from "./actions/table/inspect.ts"
export { normalizeTable } from "./actions/table/normalize.ts"
export { queryTable } from "./actions/table/query.ts"
export { inferTableSchemaFromTable } from "./actions/tableSchema/infer.ts"

export type { Frame } from "./models/frame.ts"
export type {
  InferTableSchemaOptions,
  TableSchemaOptions,
} from "./models/schema.ts"
export type { Table } from "./models/table.ts"
export type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "./plugin.ts"

export {
  ArrowPlugin,
  loadArrowTable,
  saveArrowTable,
} from "./plugins/arrow/index.ts"
export { CsvPlugin, loadCsvTable, saveCsvTable } from "./plugins/csv/index.ts"
export { InlinePlugin, loadInlineTable } from "./plugins/inline/index.ts"
export {
  JsonPlugin,
  loadJsonTable,
  saveJsonTable,
} from "./plugins/json/index.ts"
export {
  loadParquetTable,
  ParquetPlugin,
  saveParquetTable,
} from "./plugins/parquet/index.ts"
export {
  loadXlsxTable,
  saveXlsxTable,
  XlsxPlugin,
} from "./plugins/xlxs/index.ts"

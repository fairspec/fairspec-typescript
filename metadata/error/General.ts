import type { DataError } from "./types/Data.ts"
import type { FileError } from "./types/File.ts"
import type { JsonError } from "./types/Json.ts"
import type { MetadataError } from "./types/Metadata.ts"
import type { TableError } from "./types/Table.ts"

export type GeneralError =
  | MetadataError
  | DataError
  | FileError
  | TableError
  | JsonError

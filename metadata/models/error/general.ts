import { z } from "zod"
import { DataError } from "./data.ts"
import { FileError } from "./file.ts"
import { MetadataError } from "./metadata.ts"
import { TableError } from "./table.ts"

export const GeneralError = z.union([
  MetadataError,
  TableError,
  DataError,
  FileError,
])

export type GeneralError = z.infer<typeof GeneralError>

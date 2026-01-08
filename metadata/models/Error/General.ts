import { z } from "zod"
import { FileError } from "./File.ts"
import { JsonError } from "./Json.ts"
import { MetadataError } from "./Metadata.ts"
import { TableError } from "./Table.ts"

export const GeneralError = z.union([
  MetadataError,
  TableError,
  JsonError,
  FileError,
])

export type GeneralError = z.infer<typeof GeneralError>

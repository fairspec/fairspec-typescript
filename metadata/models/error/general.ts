import { z } from "zod"
import { FileError } from "./file.ts"
import { JsonError } from "./json.ts"
import { MetadataError } from "./metadata.ts"
import { TableError } from "./table.ts"

export const GeneralError = z.union([
  MetadataError,
  TableError,
  JsonError,
  FileError,
])

export type GeneralError = z.infer<typeof GeneralError>

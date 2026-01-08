import { z } from "zod"
import { FileError } from "./types/File.ts"
import { JsonError } from "./types/Json.ts"
import { MetadataError } from "./types/Metadata.ts"
import { TableError } from "./types/Table.ts"

export const GeneralError = z.union([
  MetadataError,
  TableError,
  JsonError,
  FileError,
])

export type GeneralError = z.infer<typeof GeneralError>

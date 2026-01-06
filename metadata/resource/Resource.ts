import { z } from "zod"
import { Datacite } from "../datacite/index.ts"
import { Format } from "../format/index.ts"
import { JsonSchema } from "../jsonSchema/index.ts"
import { Path } from "../path/Path.ts"
import { TableSchema } from "../tableSchema/index.ts"
import { Data } from "./Data.ts"
import { Integrity } from "./Integrity.ts"

export const Resource = Datacite.extend({
  data: Data.describe(
    "Data or content of the resource. It must be a path to a file, array of paths to files, inline JSON object, or inline JSON array of objects.",
  ),

  name: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional()
    .describe(
      "An optional name for the resource consisting of alphanumeric characters and underscores. If provided, it can be used to reference resource within a dataset context.",
    ),

  format: Format.optional().describe(
    "The format definition of the file. For multiple files the format property defines the format for all the files.",
  ),

  integrity: Integrity.optional().describe(
    "The integrity check of the file with type (md5, sha1, sha256, sha512) and hash value.",
  ),

  jsonSchema: z
    .union([Path, JsonSchema])
    .optional()
    .describe(
      "A path to a JSON Schema or an object with the JSON Schema. The JSON Schema must be compatible with the JSONSchema Draft 2020-12 specification.",
    ),

  tableSchema: z
    .union([Path, TableSchema])
    .optional()
    .describe(
      "A path to a Table Schema or an object with the Table Schema. The Table Schema must be compatible with the Fairspec Table specification.",
    ),
})

export type Resource = z.infer<typeof Resource>

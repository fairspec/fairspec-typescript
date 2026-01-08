import { z } from "zod"
import { Data } from "./data.ts"
import { Datacite } from "./datacite/datacite.ts"
import { Format } from "./format/format.ts"
import { Integrity } from "./integrity.ts"
import { JsonSchema } from "./jsonSchema.ts"
import { Path } from "./path.ts"
import { TableSchema } from "./tableSchema.ts"

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

  textual: z
    .boolean()
    .optional()
    .describe("Whether the resource is text-based."),

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

  // TODO: remove temporary solution for dataset plugins
  unstable_customMetadata: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Custom properties for extending resources"),
})

export type Resource = z.infer<typeof Resource>

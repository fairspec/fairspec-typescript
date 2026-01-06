import { z } from "zod"
import { Datacite } from "../datacite/index.ts"
import { Resource } from "../resource/Resource.ts"

export const Dataset = Datacite.extend({
  $schema: z
    .string()
    .regex(/dataset\.json$/)
    .describe(
      "URI to one of the officially published Fairspec Dataset profiles. It must end with the dataset.json suffix.",
    ),

  resources: z
    .array(Resource)
    .optional()
    .describe(
      "A list of resources. Each item must be a Resource object describing data files or inline data.",
    ),
})

export type Dataset = z.infer<typeof Dataset>

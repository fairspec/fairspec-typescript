import { z } from "zod"
import { GeneralError } from "./general.ts"

export const DatasetError = GeneralError.and(
  z.object({
    resource: z
      .string()
      .describe(
        "The resource identifier where the error occurred in the dataset",
      ),
  }),
)

export type DatasetError = z.infer<typeof DatasetError>

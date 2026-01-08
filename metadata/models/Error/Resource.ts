import { z } from "zod"
import { GeneralError } from "./General.ts"

export const ResourceError = GeneralError.and(
  z.object({
    resource: z
      .string()
      .describe("The resource identifier where the error occurred"),
  }),
)

export type ResourceError = z.infer<typeof ResourceError>

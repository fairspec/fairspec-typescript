import { z } from "zod"
import { GeneralError } from "./General.ts"
import { ResourceError } from "./Resource.ts"

export const FairspecError = z.union([GeneralError, ResourceError])

export type FairspecError = z.infer<typeof FairspecError>

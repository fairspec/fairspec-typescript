import { z } from "zod"
import { GeneralError } from "./general.ts"
import { ResourceError } from "./resource.ts"

export const FairspecError = z.union([GeneralError, ResourceError])

export type FairspecError = z.infer<typeof FairspecError>

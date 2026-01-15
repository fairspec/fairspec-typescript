import { z } from "zod"
import { DatasetError } from "./dataset.ts"
import { GeneralError } from "./general.ts"

export const FairspecError = z.union([GeneralError, DatasetError])

export type FairspecError = z.infer<typeof FairspecError>

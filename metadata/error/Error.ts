import type { GeneralError } from "./General.ts"
import type { ResourceError } from "./Resource.ts"

export type FairspecError = GeneralError | ResourceError

import type { GeneralError } from "./General.ts"

export type ResourceError = GeneralError & { resource: string }

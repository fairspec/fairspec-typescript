import type { ForeignKey } from "../../tableSchema/index.ts"
import type { BaseError } from "./Base.ts"

export interface ForeignKeyError extends BaseError {
  type: "foreignKey"
  foreignKey: ForeignKey
  cells: string[]
}

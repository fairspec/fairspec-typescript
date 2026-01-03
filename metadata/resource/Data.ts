import { z } from "zod"
import { Path } from "../path/Path.ts"

export const PathData = z.union([Path, z.array(Path)])

export const JsonData = z.union([
  z.object({}).passthrough(),
  z.array(z.object({}).passthrough()),
])

export const Data = z.union([PathData, JsonData])

export type PathData = z.infer<typeof PathData>
export type JsonData = z.infer<typeof JsonData>
export type Data = z.infer<typeof Data>

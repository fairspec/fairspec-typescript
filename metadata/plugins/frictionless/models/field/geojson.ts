import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessGeojsonConstraints =
  FrictionlessBaseConstraints.extend({
    jsonSchema: z
      .record(z.string(), z.any())
      .optional()
      .describe(
        "JSON Schema object for validating the object structure and properties",
      ),
    enum: z
      .union([z.array(z.string()), z.array(z.record(z.string(), z.any()))])
      .optional()
      .describe(
        "Restrict values to a specified set of GeoJSON objects. Serialized as strings or GeoJSON object literals",
      ),
  })

export type FrictionlessGeojsonConstraints = z.infer<
  typeof FrictionlessGeojsonConstraints
>

export const FrictionlessGeojsonField = FrictionlessBaseField.extend({
  type: z.literal("geojson").describe("Field type - discriminator property"),
  format: z
    .enum(["default", "topojson"])
    .optional()
    .describe(
      "Format of the geojson: default (standard GeoJSON), topojson (TopoJSON format)",
    ),
  constraints: FrictionlessGeojsonConstraints.optional(),
})

export type FrictionlessGeojsonField = z.infer<typeof FrictionlessGeojsonField>

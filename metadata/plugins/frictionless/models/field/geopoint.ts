import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessGeopointConstraints =
  FrictionlessBaseConstraints.extend({
    enum: z
      .union([
        z.array(z.string()),
        z.array(z.array(z.number())),
        z.array(z.record(z.string(), z.number())),
      ])
      .optional()
      .describe(
        "Restrict values to a specified set of geopoints. Format depends on the field's format setting",
      ),
  })

export type FrictionlessGeopointConstraints = z.infer<
  typeof FrictionlessGeopointConstraints
>

export const FrictionlessGeopointField = FrictionlessBaseField.extend({
  type: z.literal("geopoint").describe("Field type - discriminator property"),
  format: z
    .enum(["default", "array", "object"])
    .optional()
    .describe(
      'Format of the geopoint: default ("lon,lat" string with comma separator), array ([lon,lat] array), object ({lon:x, lat:y} object)',
    ),
  constraints: FrictionlessGeopointConstraints.optional(),
})

export type FrictionlessGeopointField = z.infer<
  typeof FrictionlessGeopointField
>

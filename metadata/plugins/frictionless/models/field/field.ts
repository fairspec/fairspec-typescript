import { z } from "zod"
import { FrictionlessAnyField } from "./any.ts"
import { FrictionlessArrayField } from "./array.ts"
import { FrictionlessBooleanField } from "./boolean.ts"
import { FrictionlessDateField } from "./date.ts"
import { FrictionlessDatetimeField } from "./datetime.ts"
import { FrictionlessDurationField } from "./duration.ts"
import { FrictionlessGeojsonField } from "./geojson.ts"
import { FrictionlessGeopointField } from "./geopoint.ts"
import { FrictionlessIntegerField } from "./integer.ts"
import { FrictionlessListField } from "./list.ts"
import { FrictionlessNumberField } from "./number.ts"
import { FrictionlessObjectField } from "./object.ts"
import { FrictionlessStringField } from "./string.ts"
import { FrictionlessTimeField } from "./time.ts"
import { FrictionlessYearField } from "./year.ts"
import { FrictionlessYearmonthField } from "./yearmonth.ts"

export const FrictionlessField = z.discriminatedUnion("type", [
  FrictionlessStringField,
  FrictionlessNumberField,
  FrictionlessIntegerField,
  FrictionlessBooleanField,
  FrictionlessObjectField,
  FrictionlessArrayField,
  FrictionlessListField,
  FrictionlessDateField,
  FrictionlessTimeField,
  FrictionlessDatetimeField,
  FrictionlessYearField,
  FrictionlessYearmonthField,
  FrictionlessDurationField,
  FrictionlessGeopointField,
  FrictionlessGeojsonField,
  FrictionlessAnyField,
])

export const FrictionlessFieldType = z.enum([
  "string",
  "number",
  "integer",
  "boolean",
  "object",
  "array",
  "list",
  "date",
  "time",
  "datetime",
  "year",
  "yearmonth",
  "duration",
  "geopoint",
  "geojson",
  "any",
])

export type FrictionlessField = z.infer<typeof FrictionlessField>
export type FrictionlessFieldType = z.infer<typeof FrictionlessFieldType>

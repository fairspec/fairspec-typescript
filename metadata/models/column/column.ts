import { z } from "zod"
import { ArrayColumn, ArrayColumnProperty } from "./array.ts"
import { Base64Column, Base64ColumnProperty } from "./base64.ts"
import { BooleanColumn, BooleanColumnProperty } from "./boolean.ts"
import {
  CategoricalColumn,
  IntegerCategoricalColumnProperty,
  StringCategoricalColumnProperty,
} from "./categorical.ts"
import { DateColumn, DateColumnProperty } from "./date.ts"
import { DatetimeColumn, DatetimeColumnProperty } from "./datetime.ts"
import { DurationColumn, DurationColumnProperty } from "./duration.ts"
import { EmailColumn, EmailColumnProperty } from "./email.ts"
import { GeojsonColumn, GeojsonColumnProperty } from "./geojson.ts"
import { HexColumn, HexColumnProperty } from "./hex.ts"
import { IntegerColumn, IntegerColumnProperty } from "./integer.ts"
import { ListColumn, ListColumnProperty } from "./list.ts"
import { NumberColumn, NumberColumnProperty } from "./number.ts"
import { ObjectColumn, ObjectColumnProperty } from "./object.ts"
import { StringColumn, StringColumnProperty } from "./string.ts"
import { TimeColumn, TimeColumnProperty } from "./time.ts"
import { TopojsonColumn, TopojsonColumnProperty } from "./topojson.ts"
import { UrlColumn, UrlColumnProperty } from "./url.ts"
import { WkbColumn, WkbColumnProperty } from "./wkb.ts"
import { WktColumn, WktColumnProperty } from "./wkt.ts"

export const Column = z.discriminatedUnion("type", [
  ArrayColumn,
  Base64Column,
  BooleanColumn,
  CategoricalColumn,
  DateColumn,
  DatetimeColumn,
  DurationColumn,
  EmailColumn,
  GeojsonColumn,
  HexColumn,
  IntegerColumn,
  ListColumn,
  NumberColumn,
  ObjectColumn,
  StringColumn,
  TimeColumn,
  TopojsonColumn,
  UrlColumn,
  WkbColumn,
  WktColumn,
])

export const ColumnType = z.enum([
  "array",
  "base64",
  "boolean",
  "categorical",
  "date",
  "datetime",
  "duration",
  "email",
  "geojson",
  "hex",
  "integer",
  "list",
  "number",
  "object",
  "string",
  "time",
  "topojson",
  "url",
  "wkb",
  "wkt",
])

const StringColumnPropertyGroup = z.discriminatedUnion("format", [
  ListColumnProperty,
  Base64ColumnProperty,
  HexColumnProperty,
  EmailColumnProperty,
  UrlColumnProperty,
  DatetimeColumnProperty,
  DateColumnProperty,
  TimeColumnProperty,
  DurationColumnProperty,
  WktColumnProperty,
  WkbColumnProperty,
  StringColumnProperty,
  StringCategoricalColumnProperty,
])

const IntegerColumnPropertyGroup = z.discriminatedUnion("format", [
  IntegerColumnProperty,
  IntegerCategoricalColumnProperty,
])

const ObjectColumnPropertyGroup = z.discriminatedUnion("format", [
  GeojsonColumnProperty,
  TopojsonColumnProperty,
  ObjectColumnProperty,
])

const NumberColumnPropertyGroup = z.discriminatedUnion("format", [
  NumberColumnProperty,
])
const BooleanColumnPropertyGroup = z.discriminatedUnion("format", [
  BooleanColumnProperty,
])
const ArrayColumnPropertyGroup = z.discriminatedUnion("format", [
  ArrayColumnProperty,
])

export const ColumnProperty = z.discriminatedUnion("type", [
  StringColumnPropertyGroup,
  IntegerColumnPropertyGroup,
  NumberColumnPropertyGroup,
  BooleanColumnPropertyGroup,
  ArrayColumnPropertyGroup,
  ObjectColumnPropertyGroup,
])

export type Column = z.infer<typeof Column>
export type ColumnType = z.infer<typeof ColumnType>
export type ColumnProperty = z.infer<typeof ColumnProperty>

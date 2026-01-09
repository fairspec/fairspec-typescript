import { z } from "zod"
import { ArrayColumn } from "./array.ts"
import { Base64Column } from "./base64.ts"
import { BooleanColumn } from "./boolean.ts"
import { DateColumn } from "./date.ts"
import { DatetimeColumn } from "./datetime.ts"
import { DurationColumn } from "./duration.ts"
import { EmailColumn } from "./email.ts"
import { GeojsonColumn } from "./geojson.ts"
import { HexColumn } from "./hex.ts"
import { IntegerColumn } from "./integer.ts"
import { ListColumn } from "./list.ts"
import { NumberColumn } from "./number.ts"
import { ObjectColumn } from "./object.ts"
import { StringColumn } from "./string.ts"
import { TimeColumn } from "./time.ts"
import { TopojsonColumn } from "./topojson.ts"
import { UrlColumn } from "./url.ts"
import { UuidColumn } from "./uuid.ts"
import { WkbColumn } from "./wkb.ts"
import { WktColumn } from "./wkt.ts"
import { YearColumn } from "./year.ts"

const StringColumnGroup = z.discriminatedUnion("format", [
  ListColumn,
  Base64Column,
  HexColumn,
  EmailColumn,
  UuidColumn,
  UrlColumn,
  DatetimeColumn,
  DateColumn,
  TimeColumn,
  DurationColumn,
  WktColumn,
  WkbColumn,
  StringColumn,
])

const IntegerColumnGroup = z.discriminatedUnion("format", [
  YearColumn,
  IntegerColumn,
])

const ColumnTypeObject = z.discriminatedUnion("format", [
  GeojsonColumn,
  TopojsonColumn,
  ObjectColumn,
])

const NumberColumnGroup = z.discriminatedUnion("format", [NumberColumn])

const BooleanColumnGroup = z.discriminatedUnion("format", [BooleanColumn])

const ArrayColumnGroup = z.discriminatedUnion("format", [ArrayColumn])

export const Column = z.discriminatedUnion("type", [
  StringColumnGroup,
  IntegerColumnGroup,
  NumberColumnGroup,
  BooleanColumnGroup,
  ArrayColumnGroup,
  ColumnTypeObject,
])

export const ColumnType = z.enum([
  "array",
  "base64",
  "boolean",
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
  "uuid",
  "wkb",
  "wkt",
  "year",
])

export type Column = z.infer<typeof Column>
export type ColumnType = z.infer<typeof ColumnType>

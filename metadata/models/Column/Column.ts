import { z } from "zod"
import { ArrayColumn } from "./Array.ts"
import { Base64Column } from "./Base64.ts"
import { BooleanColumn } from "./Boolean.ts"
import { DateColumn } from "./Date.ts"
import { DatetimeColumn } from "./Datetime.ts"
import { DurationColumn } from "./Duration.ts"
import { EmailColumn } from "./Email.ts"
import { GeojsonColumn } from "./Geojson.ts"
import { HexColumn } from "./Hex.ts"
import { IntegerColumn } from "./Integer.ts"
import { ListColumn } from "./List.ts"
import { NumberColumn } from "./Number.ts"
import { ObjectColumn } from "./Object.ts"
import { StringColumn } from "./String.ts"
import { TimeColumn } from "./Time.ts"
import { TopojsonColumn } from "./Topojson.ts"
import { UrlColumn } from "./Url.ts"
import { UuidColumn } from "./Uuid.ts"
import { WkbColumn } from "./Wkb.ts"
import { WktColumn } from "./Wkt.ts"
import { YearColumn } from "./Year.ts"

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

export type ColumnType = z.infer<typeof ColumnType>
export type Column = z.infer<typeof Column>

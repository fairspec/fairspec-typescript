import { z } from "zod"
import { ArrayColumn } from "./types/Array.ts"
import { Base64Column } from "./types/Base64.ts"
import { BooleanColumn } from "./types/Boolean.ts"
import { DateColumn } from "./types/Date.ts"
import { DatetimeColumn } from "./types/Datetime.ts"
import { DurationColumn } from "./types/Duration.ts"
import { EmailColumn } from "./types/Email.ts"
import { GeojsonColumn } from "./types/Geojson.ts"
import { HexColumn } from "./types/Hex.ts"
import { IntegerColumn } from "./types/Integer.ts"
import { ListColumn } from "./types/List.ts"
import { NumberColumn } from "./types/Number.ts"
import { ObjectColumn } from "./types/Object.ts"
import { StringColumn } from "./types/String.ts"
import { TimeColumn } from "./types/Time.ts"
import { TopojsonColumn } from "./types/Topojson.ts"
import { UrlColumn } from "./types/Url.ts"
import { UuidColumn } from "./types/Uuid.ts"
import { WkbColumn } from "./types/Wkb.ts"
import { WktColumn } from "./types/Wkt.ts"
import { YearColumn } from "./types/Year.ts"

const ColumnTypeString = z.discriminatedUnion("format", [
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

const ColumnTypeInteger = z.discriminatedUnion("format", [
  YearColumn,
  IntegerColumn,
])

const ColumnTypeObject = z.discriminatedUnion("format", [
  GeojsonColumn,
  TopojsonColumn,
  ObjectColumn,
])

const ColumnTypeNumber = z.discriminatedUnion("format", [NumberColumn])

const ColumnTypeBoolean = z.discriminatedUnion("format", [BooleanColumn])

const ColumnTypeArray = z.discriminatedUnion("format", [ArrayColumn])

export const Column = z.discriminatedUnion("type", [
  ColumnTypeString,
  ColumnTypeInteger,
  ColumnTypeNumber,
  ColumnTypeBoolean,
  ColumnTypeArray,
  ColumnTypeObject,
])

export type Column = z.infer<typeof Column>

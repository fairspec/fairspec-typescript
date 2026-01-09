import { z } from "zod"
import { ArrayColumn } from "./column/array.ts"
import { Base64Column } from "./column/base64.ts"
import { BooleanColumn } from "./column/boolean.ts"
import { DateColumn } from "./column/date.ts"
import { DatetimeColumn } from "./column/datetime.ts"
import { DurationColumn } from "./column/duration.ts"
import { EmailColumn } from "./column/email.ts"
import { GeojsonColumn } from "./column/geojson.ts"
import { HexColumn } from "./column/hex.ts"
import { IntegerColumn } from "./column/integer.ts"
import { ListColumn } from "./column/list.ts"
import { NumberColumn } from "./column/number.ts"
import { ObjectColumn } from "./column/object.ts"
import { StringColumn } from "./column/string.ts"
import { TimeColumn } from "./column/time.ts"
import { TopojsonColumn } from "./column/topojson.ts"
import { UrlColumn } from "./column/url.ts"
import { UuidColumn } from "./column/uuid.ts"
import { WkbColumn } from "./column/wkb.ts"
import { WktColumn } from "./column/wkt.ts"
import { YearColumn } from "./column/year.ts"

const StringTableProperty = z.discriminatedUnion("format", [
  ListColumn.shape.property,
  Base64Column.shape.property,
  HexColumn.shape.property,
  EmailColumn.shape.property,
  UuidColumn.shape.property,
  UrlColumn.shape.property,
  DatetimeColumn.shape.property,
  DateColumn.shape.property,
  TimeColumn.shape.property,
  DurationColumn.shape.property,
  WktColumn.shape.property,
  WkbColumn.shape.property,
  StringColumn.shape.property,
])

const IntegerTableProperty = z.discriminatedUnion("format", [
  YearColumn.shape.property,
  IntegerColumn.shape.property,
])

const ObjectTableProperty = z.discriminatedUnion("format", [
  GeojsonColumn.shape.property,
  TopojsonColumn.shape.property,
  ObjectColumn.shape.property,
])

const NumberTableProperty = z.discriminatedUnion("format", [
  NumberColumn.shape.property,
])
const BooleanTableProperty = z.discriminatedUnion("format", [
  BooleanColumn.shape.property,
])
const ArrayTableProperty = z.discriminatedUnion("format", [
  ArrayColumn.shape.property,
])

export const TableProperty = z.discriminatedUnion("type", [
  StringTableProperty,
  IntegerTableProperty,
  NumberTableProperty,
  BooleanTableProperty,
  ArrayTableProperty,
  ObjectTableProperty,
])

export type TableProperty = z.infer<typeof TableProperty>

import type { Column } from "@fairspec/metadata"
import { MysqlDialect } from "kysely"
import { createPool } from "mysql2"
import type { DatabaseColumn } from "../models/column.ts"
import { BaseDriver } from "./base.ts"

// TODO: Support more native types

export class MysqlDriver extends BaseDriver {
  nativeTypes = [
    "boolean",
    "date-time",
    "integer",
    "number",
    "string",
  ] satisfies Column["type"][]

  async createDialect(path: string) {
    return new MysqlDialect({
      pool: createPool({ uri: path }),
    })
  }

  convertColumnPropertyFromDatabase(
    databaseType: DatabaseColumn["dataType"],
  ): Column["property"] {
    switch (databaseType.toLowerCase()) {
      case "bit":
      case "bool":
      case "boolean":
        return { type: "boolean" }
      case "tinyint":
      case "smallint":
      case "mediumint":
      case "int":
      case "integer":
      case "bigint":
        return { type: "integer" }
      case "decimal":
      case "numeric":
      case "float":
      case "double":
      case "real":
        return { type: "number" }
      case "char":
      case "varchar":
      case "tinytext":
      case "text":
      case "mediumtext":
      case "longtext":
      case "enum":
      case "set":
        return { type: "string" }
      case "date":
        return { type: "string", format: "date" }
      case "time":
        return { type: "string", format: "time" }
      case "datetime":
      case "timestamp":
        return { type: "string", format: "date-time" }
      case "json":
        return { type: "object" }
      case "geometry":
      case "point":
      case "linestring":
      case "polygon":
      case "multipoint":
      case "multilinestring":
      case "multipolygon":
      case "geometrycollection":
        return { type: "object", format: "geojson" }
      default:
        return {}
    }
  }

  convertColumnTypeToDatabase(
    columnType: Column["type"],
  ): DatabaseColumn["dataType"] {
    switch (columnType) {
      case "boolean":
        return "boolean"
      case "date-time":
        return "datetime"
      case "integer":
        return "integer"
      case "number":
        return "double precision"
      case "string":
        return "text"
      default:
        return "text"
    }
  }
}

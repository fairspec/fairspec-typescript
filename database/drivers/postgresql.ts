import type { Column } from "@fairspec/metadata"
import { PostgresDialect } from "kysely"
import { Pool } from "pg"
import type { DatabaseColumn } from "../models/column.ts"
import { BaseDriver } from "./base.ts"

// TODO: Support more native types

export class PostgresqlDriver extends BaseDriver {
  nativeTypes = [
    "boolean",
    "date-time",
    "integer",
    "number",
    "string",
  ] satisfies Column["type"][]

  async createDialect(path: string) {
    return new PostgresDialect({
      pool: new Pool({ connectionString: path }),
    })
  }

  convertColumnPropertyFromDatabase(
    databaseType: DatabaseColumn["dataType"],
  ): Column["property"] {
    switch (databaseType.toLowerCase()) {
      case "boolean":
      case "bool":
        return { type: "boolean" }
      case "smallint":
      case "integer":
      case "int":
      case "int2":
      case "int4":
      case "int8":
      case "bigint":
      case "smallserial":
      case "serial":
      case "bigserial":
        return { type: "integer" }
      case "decimal":
      case "numeric":
      case "real":
      case "float4":
      case "double precision":
      case "float8":
        return { type: "number" }
      case "char":
      case "character":
      case "varchar":
      case "character varying":
      case "text":
      case "citext":
      case "uuid":
        return { type: "string" }
      case "date":
        return { type: "string", format: "date" }
      case "time":
      case "time without time zone":
      case "time with time zone":
      case "timetz":
        return { type: "string", format: "time" }
      case "timestamp":
      case "timestamp without time zone":
      case "timestamp with time zone":
      case "timestamptz":
        return { type: "string", format: "date-time" }
      case "interval":
        return { type: "string", format: "duration" }
      case "json":
      case "jsonb":
        return { type: "object" }
      case "point":
      case "line":
      case "lseg":
      case "box":
      case "path":
      case "polygon":
      case "circle":
      case "geometry":
      case "geography":
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
        return "timestamp"
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

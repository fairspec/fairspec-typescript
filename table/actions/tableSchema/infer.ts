import type { Column, TableSchema } from "@fairspec/metadata"
import { getColumnProperties } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { getPolarsSchema } from "../../helpers/schema.ts"
import type { InferTableSchemaOptions } from "../../models/schema.ts"
import type { Table } from "../../models/table.ts"

// TODO: Implement actual options usage for inferring

export async function inferTableSchemaFromTable(
  table: Table,
  options?: InferTableSchemaOptions,
) {
  const { sampleRows = 100 } = options ?? {}

  const sample = await table.head(sampleRows).collect()
  return inferTableSchemaFromSample(sample, options)
}

export function inferTableSchemaFromSample(
  sample: pl.DataFrame,
  options?: Exclude<InferTableSchemaOptions, "sampleRows">,
) {
  const { confidence = 0.9, columnTypes, keepStrings } = options ?? {}

  const typeMapping = createTypeMapping()
  const regexMapping = createRegexMapping(options)

  const polarsSchema = getPolarsSchema(sample.schema)
  const columnNames =
    options?.columnNames ?? polarsSchema.columns.map(f => f.name)

  const failureThreshold =
    sample.height - Math.floor(sample.height * confidence) || 1

  const columns: Column[] = []
  for (const name of columnNames) {
    const polarsColumn = polarsSchema.columns.find(f => f.name === name)
    if (!polarsColumn) {
      throw new Error(`Column "${name}" not found in the table`)
    }

    // TODO: Remove this workaround once the issue is fixed
    // https://github.com/pola-rs/nodejs-polars/issues/372
    let variant = polarsColumn.type.variant as string
    if (!typeMapping[variant]) {
      variant = variant.slice(0, -1)
    }

    const type = columnTypes?.[name] ?? typeMapping[variant] ?? "unknown"

    let column: Column
    switch (type) {
      case "boolean":
        column = { name, type: "boolean", property: { type: "boolean" } }
        break
      case "integer":
        column = { name, type: "integer", property: { type: "integer" } }
        break
      case "number":
        column = { name, type: "number", property: { type: "number" } }
        break
      case "string":
        column = { name, type: "string", property: { type: "string" } }
        break
      case "date":
        column = {
          name,
          type: "date",
          property: { type: "string", format: "date" },
        }
        break
      case "date-time":
        column = {
          name,
          type: "date-time",
          property: { type: "string", format: "date-time" },
        }
        break
      case "time":
        column = {
          name,
          type: "time",
          property: { type: "string", format: "time" },
        }
        break
      case "array":
        column = { name, type: "array", property: { type: "array" } }
        break
      case "object":
        column = { name, type: "object", property: { type: "object" } }
        break
      default:
        column = { name, type: "unknown", property: {} }
        break
    }

    if (!columnTypes?.[name]) {
      if (type === "array") {
        if (options?.arrayType === "list") {
          column = {
            name,
            type: "list",
            property: {
              type: "string",
              format: "list",
            },
          }
        } else {
          column = { name, type: "array", property: { type: "array" } }
        }
      }

      if (type === "string") {
        if (!keepStrings) {
          for (const [regex, namelessColumn] of Object.entries(regexMapping)) {
            const failures = sample
              .filter(pl.col(name).str.contains(regex).not())
              .head(failureThreshold).height

            if (failures < failureThreshold) {
              // TODO: fix
              // @ts-expect-error
              column = { ...namelessColumn, name }
              break
            }
          }
        }
      }

      if (type === "number") {
        const failures = sample
          .filter(pl.col(name).eq(pl.col(name).round(0)).not())
          .head(failureThreshold).height

        if (failures < failureThreshold) {
          column = { name, type: "integer", property: { type: "integer" } }
        }
      }
    }

    enhanceColumn(column, options)
    columns.push(column)
  }

  const tableSchema: TableSchema = {
    properties: getColumnProperties(columns),
  }

  enhanceSchema(tableSchema, options)
  return tableSchema
}

function createTypeMapping() {
  const mapping: Record<string, Column["type"]> = {
    Array: "array",
    Bool: "boolean",
    Categorical: "string",
    Date: "date",
    Datetime: "date-time",
    Decimal: "number",
    Float32: "number",
    Float64: "number",
    Int16: "integer",
    Int32: "integer",
    Int64: "integer",
    Int8: "integer",
    List: "array",
    Null: "unknown",
    Object: "object",
    String: "string",
    Struct: "object",
    Time: "time",
    UInt16: "integer",
    UInt32: "integer",
    UInt64: "integer",
    UInt8: "integer",
    Utf8: "string",
  }

  return mapping
}

function createRegexMapping(options?: InferTableSchemaOptions) {
  const { commaDecimal, monthFirst } = options ?? {}

  const mapping: Record<string, Omit<Column, "name">> = {
    "^\\d+$": { type: "integer", property: { type: "integer" } },
    "^\\d{1,3}(,\\d{3})+$": commaDecimal
      ? { type: "number", property: { type: "number" } }
      : { type: "integer", property: { type: "integer", groupChar: "," } },
    "^\\d+\\.\\d+$": commaDecimal
      ? { type: "integer", property: { type: "integer", groupChar: "." } }
      : { type: "number", property: { type: "number" } },
    "^\\d{1,3}(,\\d{3})+\\.\\d+$": {
      type: "number",
      property: { type: "number", groupChar: "," },
    },
    "^\\d{1,3}(\\.\\d{3})+,\\d+$": {
      type: "number",
      property: { type: "number", groupChar: ".", decimalChar: "," },
    },

    "^[\\p{Sc}\\s-]*\\d+[%\\p{Sc}\\s]*$": {
      type: "integer",
      property: { type: "integer", withText: true },
    },
    "^[\\p{Sc}\\s-]*\\d{1,3}(,\\d{3})+[%\\p{Sc}\\s]*$": commaDecimal
      ? { type: "number", property: { type: "number", withText: true } }
      : {
          type: "integer",
          property: { type: "integer", groupChar: ",", withText: true },
        },
    "^[\\p{Sc}\\s-]*\\d+\\.\\d+[%\\p{Sc}\\s]*$": commaDecimal
      ? {
          type: "integer",
          property: { type: "integer", groupChar: ".", withText: true },
        }
      : { type: "number", property: { type: "number", withText: true } },
    "^[\\p{Sc}\\s-]*\\d{1,3}(,\\d{3})+\\.\\d+[%\\p{Sc}\\s]*$": {
      type: "number",
      property: { type: "number", groupChar: ",", withText: true },
    },
    "^[\\p{Sc}\\s-]*\\d{1,3}(\\.\\d{3})+,\\d+[%\\p{Sc}\\s]*$": {
      type: "number",
      property: {
        type: "number",
        groupChar: ".",
        decimalChar: ",",
        withText: true,
      },
    },

    "^(true|True|TRUE|false|False|FALSE)$": {
      type: "boolean",
      property: { type: "boolean" },
    },

    "^\\d{4}-\\d{2}-\\d{2}$": {
      type: "date",
      property: { type: "string", format: "date" },
    },
    "^\\d{4}/\\d{2}/\\d{2}$": {
      type: "date",
      property: { type: "string", format: "date", temporalFormat: "%Y/%m/%d" },
    },
    "^\\d{2}/\\d{2}/\\d{4}$": monthFirst
      ? {
          type: "date",
          property: {
            type: "string",
            format: "date",
            temporalFormat: "%m/%d/%Y",
          },
        }
      : {
          type: "date",
          property: {
            type: "string",
            format: "date",
            temporalFormat: "%d/%m/%Y",
          },
        },
    "^\\d{2}-\\d{2}-\\d{4}$": monthFirst
      ? {
          type: "date",
          property: {
            type: "string",
            format: "date",
            temporalFormat: "%m-%d-%Y",
          },
        }
      : {
          type: "date",
          property: {
            type: "string",
            format: "date",
            temporalFormat: "%d-%m-%Y",
          },
        },
    "^\\d{2}\\.\\d{2}\\.\\d{4}$": monthFirst
      ? {
          type: "date",
          property: {
            type: "string",
            format: "date",
            temporalFormat: "%m.%d.%Y",
          },
        }
      : {
          type: "date",
          property: {
            type: "string",
            format: "date",
            temporalFormat: "%d.%m.%Y",
          },
        },

    "^\\d{2}:\\d{2}:\\d{2}$": {
      type: "time",
      property: { type: "string", format: "time" },
    },
    "^\\d{2}:\\d{2}$": {
      type: "time",
      property: { type: "string", format: "time", temporalFormat: "%H:%M" },
    },
    "^\\d{1,2}:\\d{2}:\\d{2}\\s*(am|pm|AM|PM)$": {
      type: "time",
      property: {
        type: "string",
        format: "time",
        temporalFormat: "%I:%M:%S %p",
      },
    },
    "^\\d{1,2}:\\d{2}\\s*(am|pm|AM|PM)$": {
      type: "time",
      property: { type: "string", format: "time", temporalFormat: "%I:%M %p" },
    },
    "^\\d{2}:\\d{2}:\\d{2}[+-]\\d{2}:?\\d{2}$": {
      type: "time",
      property: { type: "string", format: "time" },
    },

    "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z?$": {
      type: "date-time",
      property: { type: "string", format: "date-time" },
    },
    "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}[+-]\\d{2}:?\\d{2}$": {
      type: "date-time",
      property: { type: "string", format: "date-time" },
    },
    "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$": {
      type: "date-time",
      property: {
        type: "string",
        format: "date-time",
        temporalFormat: "%Y-%m-%d %H:%M:%S",
      },
    },
    "^\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}$": monthFirst
      ? {
          type: "date-time",
          property: {
            type: "string",
            format: "date-time",
            temporalFormat: "%m/%d/%Y %H:%M",
          },
        }
      : {
          type: "date-time",
          property: {
            type: "string",
            format: "date-time",
            temporalFormat: "%d/%m/%Y %H:%M",
          },
        },
    "^\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}:\\d{2}$": monthFirst
      ? {
          type: "date-time",
          property: {
            type: "string",
            format: "date-time",
            temporalFormat: "%m/%d/%Y %H:%M:%S",
          },
        }
      : {
          type: "date-time",
          property: {
            type: "string",
            format: "date-time",
            temporalFormat: "%d/%m/%Y %H:%M:%S",
          },
        },

    "^\\{": { type: "object", property: { type: "object" } },

    "^\\[": { type: "array", property: { type: "array" } },

    "^\\d+,\\d+$": {
      type: "list",
      property: { type: "string", format: "list", itemType: "integer" },
    },
    "^[\\d.]+,[\\d.]+$": {
      type: "list",
      property: { type: "string", format: "list", itemType: "number" },
    },

    "^https?://\\S+$": {
      type: "url",
      property: { type: "string", format: "url" },
    },

    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$": {
      type: "email",
      property: { type: "string", format: "email" },
    },

    "^(POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION)\\s*\\(":
      {
        type: "wkt",
        property: { type: "string", format: "wkt" },
      },

    "^P(\\d+Y)?(\\d+M)?(\\d+W)?(\\d+D)?(T(\\d+H)?(\\d+M)?(\\d+(\\.\\d+)?S)?)?$":
      {
        type: "duration",
        property: { type: "string", format: "duration" },
      },

    "^([0-9a-fA-F]{2}){8,}$": {
      type: "hex",
      property: { type: "string", format: "hex" },
    },
  }

  return mapping
}

function enhanceColumn(column: Column, options?: InferTableSchemaOptions) {
  if (column.type === "boolean") {
    if (options?.trueValues !== undefined) {
      column.property.trueValues = options.trueValues
    }
    if (options?.falseValues !== undefined) {
      column.property.falseValues = options.falseValues
    }
  } else if (column.type === "integer") {
    if (options?.groupChar !== undefined) {
      column.property.groupChar = options.groupChar
    }
  } else if (column.type === "number") {
    if (options?.decimalChar !== undefined) {
      column.property.decimalChar = options.decimalChar
    }
    if (options?.groupChar !== undefined) {
      column.property.groupChar = options.groupChar
    }
  } else if (column.type === "date-time") {
    if (options?.datetimeFormat !== undefined) {
      column.property.temporalFormat = options.datetimeFormat
    }
  } else if (column.type === "date") {
    if (options?.dateFormat !== undefined) {
      column.property.temporalFormat = options.dateFormat
    }
  } else if (column.type === "time") {
    if (options?.timeFormat !== undefined) {
      column.property.temporalFormat = options.timeFormat
    }
  } else if (column.type === "list") {
    if (options?.listDelimiter !== undefined) {
      column.property.delimiter = options.listDelimiter
    }
    if (options?.listItemType !== undefined) {
      column.property.itemType = options.listItemType
    }
  }
}

function enhanceSchema(
  tableSchema: TableSchema,
  options?: InferTableSchemaOptions,
) {
  if (options?.missingValues !== undefined) {
    tableSchema.missingValues = options.missingValues
  }
}

import type { Column } from "../../../../models/column/column.ts"
import type { TableSchema } from "../../../../models/tableSchema.ts"
import type { FrictionlessField } from "../../models/field/field.ts"
import type { FrictionlessSchema } from "../../models/schema.ts"

export function convertTableSchemaFromFrictionless(
  frictionlessSchema: FrictionlessSchema,
): TableSchema {
  const properties: Record<string, Column> = {}
  for (const field of frictionlessSchema.fields) {
    properties[field.name] = convertColumn(field)
  }

  const required = frictionlessSchema.fields
    .filter(f => f.constraints?.required === true)
    .map(f => f.name)

  const foreignKeys = frictionlessSchema.foreignKeys?.map(fk => ({
    columns: fk.fields,
    reference: {
      resource: fk.reference.resource,
      columns: fk.reference.fields,
    },
  }))

  const uniqueKeys = frictionlessSchema.uniqueKeys

  const tableSchema: TableSchema = {
    $schema: "https://fairspec.org/profiles/latest/table.json",
    properties,
  }

  if (frictionlessSchema.title) {
    tableSchema.title = frictionlessSchema.title
  }
  if (frictionlessSchema.description) {
    tableSchema.description = frictionlessSchema.description
  }
  if (required.length > 0) {
    tableSchema.required = required
  }
  if (frictionlessSchema.missingValues) {
    tableSchema.missingValues = frictionlessSchema.missingValues
  }
  if (frictionlessSchema.primaryKey) {
    tableSchema.primaryKey = frictionlessSchema.primaryKey
  }
  if (uniqueKeys && uniqueKeys.length > 0) {
    tableSchema.uniqueKeys = uniqueKeys
  }
  if (foreignKeys && foreignKeys.length > 0) {
    tableSchema.foreignKeys = foreignKeys
  }

  return tableSchema
}

function convertColumn(field: FrictionlessField): Column {
  switch (field.type) {
    case "string": {
      if (field.format === "email") {
        const column: Column = { type: "string", format: "email" }
        if (field.title) column.title = field.title
        if (field.description) column.description = field.description
        if (field.rdfType) column.rdfType = field.rdfType
        if (field.constraints?.enum) column.enum = field.constraints.enum
        if (field.constraints?.pattern)
          column.pattern = field.constraints.pattern
        if (field.constraints?.minLength)
          column.minLength = field.constraints.minLength
        if (field.constraints?.maxLength)
          column.maxLength = field.constraints.maxLength
        if (field.categories) column.categories = field.categories
        if (field.missingValues) column.missingValues = field.missingValues
        return column
      }
      if (field.format === "uri") {
        const column: Column = { type: "string", format: "url" }
        if (field.title) column.title = field.title
        if (field.description) column.description = field.description
        if (field.rdfType) column.rdfType = field.rdfType
        if (field.constraints?.enum) column.enum = field.constraints.enum
        if (field.constraints?.pattern)
          column.pattern = field.constraints.pattern
        if (field.constraints?.minLength)
          column.minLength = field.constraints.minLength
        if (field.constraints?.maxLength)
          column.maxLength = field.constraints.maxLength
        if (field.categories) column.categories = field.categories
        if (field.missingValues) column.missingValues = field.missingValues
        return column
      }
      if (field.format === "binary") {
        const column: Column = { type: "string", format: "base64" }
        if (field.title) column.title = field.title
        if (field.description) column.description = field.description
        if (field.rdfType) column.rdfType = field.rdfType
        if (field.constraints?.enum) column.enum = field.constraints.enum
        if (field.constraints?.pattern)
          column.pattern = field.constraints.pattern
        if (field.constraints?.minLength)
          column.minLength = field.constraints.minLength
        if (field.constraints?.maxLength)
          column.maxLength = field.constraints.maxLength
        if (field.categories) column.categories = field.categories
        if (field.missingValues) column.missingValues = field.missingValues
        return column
      }
      if (field.format === "uuid") {
        const column: Column = { type: "string", format: "uuid" }
        if (field.title) column.title = field.title
        if (field.description) column.description = field.description
        if (field.rdfType) column.rdfType = field.rdfType
        if (field.constraints?.enum) column.enum = field.constraints.enum
        if (field.constraints?.pattern)
          column.pattern = field.constraints.pattern
        if (field.constraints?.minLength)
          column.minLength = field.constraints.minLength
        if (field.constraints?.maxLength)
          column.maxLength = field.constraints.maxLength
        if (field.categories) column.categories = field.categories
        if (field.missingValues) column.missingValues = field.missingValues
        return column
      }
      const column: Column = { type: "string" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (field.constraints?.enum) column.enum = field.constraints.enum
      if (field.constraints?.pattern) column.pattern = field.constraints.pattern
      if (field.constraints?.minLength)
        column.minLength = field.constraints.minLength
      if (field.constraints?.maxLength)
        column.maxLength = field.constraints.maxLength
      if (field.categories) column.categories = field.categories
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "number": {
      const column: Column = { type: "number" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (
        field.constraints?.enum &&
        Array.isArray(field.constraints.enum) &&
        typeof field.constraints.enum[0] === "number"
      ) {
        column.enum = field.constraints.enum as number[]
      }
      if (typeof field.constraints?.minimum === "number") {
        column.minimum = field.constraints.minimum
      }
      if (typeof field.constraints?.maximum === "number") {
        column.maximum = field.constraints.maximum
      }
      if (typeof field.constraints?.exclusiveMinimum === "number") {
        column.exclusiveMinimum = field.constraints.exclusiveMinimum
      }
      if (typeof field.constraints?.exclusiveMaximum === "number") {
        column.exclusiveMaximum = field.constraints.exclusiveMaximum
      }
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "integer": {
      const column: Column = { type: "integer" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (
        field.constraints?.enum &&
        Array.isArray(field.constraints.enum) &&
        typeof field.constraints.enum[0] === "number"
      ) {
        column.enum = field.constraints.enum as number[]
      }
      if (typeof field.constraints?.minimum === "number") {
        column.minimum = field.constraints.minimum
      }
      if (typeof field.constraints?.maximum === "number") {
        column.maximum = field.constraints.maximum
      }
      if (typeof field.constraints?.exclusiveMinimum === "number") {
        column.exclusiveMinimum = field.constraints.exclusiveMinimum
      }
      if (typeof field.constraints?.exclusiveMaximum === "number") {
        column.exclusiveMaximum = field.constraints.exclusiveMaximum
      }
      if (field.groupChar) column.groupChar = field.groupChar
      if (field.bareNumber !== undefined) {
        column.withText = !field.bareNumber
      }
      if (field.categories) column.categories = field.categories
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "boolean": {
      const column: Column = { type: "boolean" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (
        field.constraints?.enum &&
        Array.isArray(field.constraints.enum) &&
        typeof field.constraints.enum[0] === "boolean"
      ) {
        column.enum = field.constraints.enum as boolean[]
      }
      if (field.trueValues) column.trueValues = field.trueValues
      if (field.falseValues) column.falseValues = field.falseValues
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "date": {
      const column: Column = { type: "string", format: "date" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (
        field.format &&
        field.format !== "default" &&
        field.format !== "any"
      ) {
        column.temporalFormat = field.format
      }
      if (field.constraints?.enum) column.enum = field.constraints.enum
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "time": {
      const column: Column = { type: "string", format: "time" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (
        field.format &&
        field.format !== "default" &&
        field.format !== "any"
      ) {
        column.temporalFormat = field.format
      }
      if (field.constraints?.enum) column.enum = field.constraints.enum
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "datetime": {
      const column: Column = { type: "string", format: "date-time" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (
        field.format &&
        field.format !== "default" &&
        field.format !== "any"
      ) {
        column.temporalFormat = field.format
      }
      if (field.constraints?.enum) column.enum = field.constraints.enum
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "year": {
      const column: Column = { type: "integer", format: "year" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (
        field.constraints?.enum &&
        Array.isArray(field.constraints.enum) &&
        typeof field.constraints.enum[0] === "number"
      ) {
        column.enum = field.constraints.enum as number[]
      }
      if (typeof field.constraints?.minimum === "number") {
        column.minimum = field.constraints.minimum
      }
      if (typeof field.constraints?.maximum === "number") {
        column.maximum = field.constraints.maximum
      }
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "duration": {
      const column: Column = { type: "string", format: "duration" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (field.constraints?.enum) column.enum = field.constraints.enum
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "array": {
      const column: Column = { type: "array" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "object": {
      const column: Column = { type: "object" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      return column
    }

    case "list": {
      const column: Column = { type: "string", format: "list" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (field.itemType) column.itemType = field.itemType
      if (field.delimiter) column.delimiter = field.delimiter
      if (
        field.constraints?.enum &&
        Array.isArray(field.constraints.enum) &&
        typeof field.constraints.enum[0] === "string"
      ) {
        column.enum = field.constraints.enum as string[]
      }
      if (field.constraints?.minLength)
        column.minLength = field.constraints.minLength
      if (field.constraints?.maxLength)
        column.maxLength = field.constraints.maxLength
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "geojson": {
      const format = field.format === "topojson" ? "topojson" : "geojson"
      const column: Column = { type: "object", format }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      return column
    }

    case "geopoint": {
      const column: Column = { type: "string" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "yearmonth": {
      const column: Column = { type: "string" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    case "any": {
      const column: Column = { type: "string" }
      if (field.title) column.title = field.title
      if (field.description) column.description = field.description
      if (field.rdfType) column.rdfType = field.rdfType
      if (field.missingValues) column.missingValues = field.missingValues
      return column
    }

    default: {
      throw new Error(`Unsupported field type: ${(field as any).type}`)
    }
  }
}

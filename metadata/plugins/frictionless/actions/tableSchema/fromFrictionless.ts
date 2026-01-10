import { getColumnProperties } from "../../../../actions/tableSchema/column.ts"
import type { Column } from "../../../../models/column/column.ts"
import type { TableSchema } from "../../../../models/tableSchema.ts"
import type { FrictionlessField } from "../../models/field/field.ts"
import type { FrictionlessSchema } from "../../models/schema.ts"

export function convertTableSchemaFromFrictionless(
  frictionlessSchema: FrictionlessSchema,
): TableSchema {
  const columns: Column[] = []
  for (const field of frictionlessSchema.fields) {
    columns.push(convertFieldToColumn(field))
  }

  const properties: Record<string, Column["property"]> = {}
  const columnProperties = getColumnProperties(columns)
  for (let i = 0; i < columns.length; i++) {
    const prop = columnProperties[i]
    const col = columns[i]
    if (prop && col) {
      properties[col.name] = prop
    }
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

function convertFieldToColumn(field: FrictionlessField): Column {
  switch (field.type) {
    case "string": {
      if (field.format === "email") {
        const property: Column["property"] = { type: "string", format: "email" }
        if (field.title) property.title = field.title
        if (field.description) property.description = field.description
        if (field.rdfType) property.rdfType = field.rdfType
        if (field.constraints?.enum) property.enum = field.constraints.enum
        if (field.constraints?.pattern)
          property.pattern = field.constraints.pattern
        if (field.constraints?.minLength)
          property.minLength = field.constraints.minLength
        if (field.constraints?.maxLength)
          property.maxLength = field.constraints.maxLength
        if (field.missingValues) property.missingValues = field.missingValues
        return { name: field.name, type: "email", property }
      }
      if (field.format === "uri") {
        const property: Column["property"] = { type: "string", format: "url" }
        if (field.title) property.title = field.title
        if (field.description) property.description = field.description
        if (field.rdfType) property.rdfType = field.rdfType
        if (field.constraints?.enum) property.enum = field.constraints.enum
        if (field.constraints?.pattern)
          property.pattern = field.constraints.pattern
        if (field.constraints?.minLength)
          property.minLength = field.constraints.minLength
        if (field.constraints?.maxLength)
          property.maxLength = field.constraints.maxLength
        if (field.missingValues) property.missingValues = field.missingValues
        return { name: field.name, type: "url", property }
      }
      if (field.format === "binary") {
        const property: Column["property"] = {
          type: "string",
          format: "base64",
        }
        if (field.title) property.title = field.title
        if (field.description) property.description = field.description
        if (field.rdfType) property.rdfType = field.rdfType
        if (field.constraints?.enum) property.enum = field.constraints.enum
        if (field.constraints?.pattern)
          property.pattern = field.constraints.pattern
        if (field.constraints?.minLength)
          property.minLength = field.constraints.minLength
        if (field.constraints?.maxLength)
          property.maxLength = field.constraints.maxLength
        if (field.missingValues) property.missingValues = field.missingValues
        return { name: field.name, type: "base64", property }
      }
      const property: Column["property"] = { type: "string" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (field.constraints?.enum) property.enum = field.constraints.enum
      if (field.constraints?.pattern)
        property.pattern = field.constraints.pattern
      if (field.constraints?.minLength)
        property.minLength = field.constraints.minLength
      if (field.constraints?.maxLength)
        property.maxLength = field.constraints.maxLength
      if (field.categories) property.categories = field.categories
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "string", property }
    }

    case "number": {
      const property: Column["property"] = { type: "number" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (
        field.constraints?.enum &&
        Array.isArray(field.constraints.enum) &&
        typeof field.constraints.enum[0] === "number"
      ) {
        property.enum = field.constraints.enum as number[]
      }
      if (typeof field.constraints?.minimum === "number") {
        property.minimum = field.constraints.minimum
      }
      if (typeof field.constraints?.maximum === "number") {
        property.maximum = field.constraints.maximum
      }
      if (typeof field.constraints?.exclusiveMinimum === "number") {
        property.exclusiveMinimum = field.constraints.exclusiveMinimum
      }
      if (typeof field.constraints?.exclusiveMaximum === "number") {
        property.exclusiveMaximum = field.constraints.exclusiveMaximum
      }
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "number", property }
    }

    case "integer": {
      const property: Column["property"] = { type: "integer" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (
        field.constraints?.enum &&
        Array.isArray(field.constraints.enum) &&
        typeof field.constraints.enum[0] === "number"
      ) {
        property.enum = field.constraints.enum as number[]
      }
      if (typeof field.constraints?.minimum === "number") {
        property.minimum = field.constraints.minimum
      }
      if (typeof field.constraints?.maximum === "number") {
        property.maximum = field.constraints.maximum
      }
      if (typeof field.constraints?.exclusiveMinimum === "number") {
        property.exclusiveMinimum = field.constraints.exclusiveMinimum
      }
      if (typeof field.constraints?.exclusiveMaximum === "number") {
        property.exclusiveMaximum = field.constraints.exclusiveMaximum
      }
      if (field.groupChar) property.groupChar = field.groupChar
      if (field.bareNumber !== undefined) {
        property.withText = !field.bareNumber
      }
      if (field.categories) property.categories = field.categories
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "integer", property }
    }

    case "boolean": {
      const property: Column["property"] = { type: "boolean" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (field.trueValues) property.trueValues = field.trueValues
      if (field.falseValues) property.falseValues = field.falseValues
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "boolean", property }
    }

    case "date": {
      const property: Column["property"] = { type: "string", format: "date" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (
        field.format &&
        field.format !== "default" &&
        field.format !== "any"
      ) {
        property.temporalFormat = field.format
      }
      if (field.constraints?.enum) property.enum = field.constraints.enum
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "date", property }
    }

    case "time": {
      const property: Column["property"] = { type: "string", format: "time" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (
        field.format &&
        field.format !== "default" &&
        field.format !== "any"
      ) {
        property.temporalFormat = field.format
      }
      if (field.constraints?.enum) property.enum = field.constraints.enum
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "time", property }
    }

    case "datetime": {
      const property: Column["property"] = {
        type: "string",
        format: "date-time",
      }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (
        field.format &&
        field.format !== "default" &&
        field.format !== "any"
      ) {
        property.temporalFormat = field.format
      }
      if (field.constraints?.enum) property.enum = field.constraints.enum
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "datetime", property }
    }

    case "year": {
      const property: Column["property"] = { type: "integer" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (
        field.constraints?.enum &&
        Array.isArray(field.constraints.enum) &&
        typeof field.constraints.enum[0] === "number"
      ) {
        property.enum = field.constraints.enum as number[]
      }
      if (typeof field.constraints?.minimum === "number") {
        property.minimum = field.constraints.minimum
      }
      if (typeof field.constraints?.maximum === "number") {
        property.maximum = field.constraints.maximum
      }
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "integer", property }
    }

    case "duration": {
      const property: Column["property"] = {
        type: "string",
        format: "duration",
      }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (field.constraints?.enum) property.enum = field.constraints.enum
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "duration", property }
    }

    case "array": {
      const property: Column["property"] = { type: "array" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "array", property }
    }

    case "object": {
      const property: Column["property"] = { type: "object" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      return { name: field.name, type: "object", property }
    }

    case "list": {
      const property: Column["property"] = { type: "string", format: "list" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (field.itemType) property.itemType = field.itemType
      if (field.delimiter) property.delimiter = field.delimiter
      if (
        field.constraints?.enum &&
        Array.isArray(field.constraints.enum) &&
        typeof field.constraints.enum[0] === "string"
      ) {
        property.enum = field.constraints.enum as string[]
      }
      if (field.constraints?.minLength)
        property.minLength = field.constraints.minLength
      if (field.constraints?.maxLength)
        property.maxLength = field.constraints.maxLength
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "list", property }
    }

    case "geojson": {
      if (field.format === "topojson") {
        const property: Column["property"] = {
          type: "object",
          format: "topojson",
          ...(field.title && { title: field.title }),
          ...(field.description && { description: field.description }),
          ...(field.rdfType && { rdfType: field.rdfType }),
        }
        return { name: field.name, type: "topojson", property }
      }
      const property: Column["property"] = {
        type: "object",
        format: "geojson",
        ...(field.title && { title: field.title }),
        ...(field.description && { description: field.description }),
        ...(field.rdfType && { rdfType: field.rdfType }),
      }
      return { name: field.name, type: "geojson", property }
    }

    case "geopoint": {
      const property: Column["property"] = { type: "string" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "string", property }
    }

    case "yearmonth": {
      const property: Column["property"] = { type: "string" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "string", property }
    }

    case "any": {
      const property: Column["property"] = { type: "string" }
      if (field.title) property.title = field.title
      if (field.description) property.description = field.description
      if (field.rdfType) property.rdfType = field.rdfType
      if (field.missingValues) property.missingValues = field.missingValues
      return { name: field.name, type: "string", property }
    }

    default: {
      throw new Error(`Unsupported field type: ${(field as any).type}`)
    }
  }
}

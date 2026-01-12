import type { Column, TableSchema } from "@fairspec/metadata"
import { getColumns } from "@fairspec/metadata"
import type { FrictionlessArrayField } from "../../models/field/array.ts"
import type { FrictionlessBooleanField } from "../../models/field/boolean.ts"
import type { FrictionlessDateField } from "../../models/field/date.ts"
import type { FrictionlessDatetimeField } from "../../models/field/datetime.ts"
import type { FrictionlessDurationField } from "../../models/field/duration.ts"
import type { FrictionlessField } from "../../models/field/field.ts"
import type { FrictionlessGeojsonField } from "../../models/field/geojson.ts"
import type { FrictionlessIntegerField } from "../../models/field/integer.ts"
import type { FrictionlessListField } from "../../models/field/list.ts"
import type { FrictionlessNumberField } from "../../models/field/number.ts"
import type { FrictionlessObjectField } from "../../models/field/object.ts"
import type { FrictionlessStringField } from "../../models/field/string.ts"
import type { FrictionlessTimeField } from "../../models/field/time.ts"
import type { FrictionlessSchema } from "../../models/schema.ts"

export function convertTableSchemaToFrictionless(
  tableSchema: TableSchema,
): FrictionlessSchema {
  const fields: FrictionlessField[] = []
  const requiredSet = new Set(tableSchema.required ?? [])

  for (const column of getColumns(tableSchema)) {
    const field = convertColumnToField(column, requiredSet.has(column.name))
    fields.push(field)
  }

  const frictionlessSchema: FrictionlessSchema = {
    fields,
  }

  if (tableSchema.title) {
    frictionlessSchema.title = tableSchema.title
  }

  if (tableSchema.description) {
    frictionlessSchema.description = tableSchema.description
  }

  if (tableSchema.missingValues) {
    frictionlessSchema.missingValues = tableSchema.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (tableSchema.primaryKey) {
    frictionlessSchema.primaryKey = tableSchema.primaryKey
  }

  if (tableSchema.uniqueKeys) {
    frictionlessSchema.uniqueKeys = tableSchema.uniqueKeys
  }

  if (tableSchema.foreignKeys) {
    frictionlessSchema.foreignKeys = tableSchema.foreignKeys.map(fk => ({
      fields: fk.columns,
      reference: {
        resource: fk.reference.resource,
        fields: fk.reference.columns,
      },
    }))
  }

  return frictionlessSchema
}

function convertColumnToField(
  column: Column,
  isRequired: boolean,
): FrictionlessField {
  switch (column.type) {
    case "string":
    case "base64":
    case "hex":
    case "email":
    case "url":
    case "wkt":
    case "wkb":
      return convertToStringField(column, isRequired)
    case "date":
      return convertToDateField(column, isRequired)
    case "time":
      return convertToTimeField(column, isRequired)
    case "date-time":
      return convertToDatetimeField(column, isRequired)
    case "duration":
      return convertToDurationField(column, isRequired)
    case "list":
      return convertToListField(column, isRequired)
    case "integer":
      return convertToIntegerField(column, isRequired)
    case "number":
      return convertToNumberField(column, isRequired)
    case "boolean":
      return convertToBooleanField(column, isRequired)
    case "array":
      return convertToArrayField(column, isRequired)
    case "object":
      return convertToObjectField(column, isRequired)
    case "geojson":
    case "topojson":
      return convertToGeojsonField(column, isRequired)
    default:
      // TODO: Improve
      return { name: column.name, type: "any" }
  }
}

function convertToStringField(
  column: Column & {
    type: "string" | "base64" | "hex" | "email" | "uuid" | "url" | "wkt" | "wkb"
  },
  isRequired: boolean,
): FrictionlessStringField {
  const field: FrictionlessStringField = {
    name: column.name,
    type: "string",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (
    column.property.format === "email" ||
    column.property.format === "url" ||
    column.property.format === "base64"
  ) {
    field.format =
      column.property.format === "url"
        ? "uri"
        : column.property.format === "base64"
          ? "binary"
          : column.property.format
  }

  if (column.property.enum) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.enum = column.property.enum
  }

  if (column.property.pattern) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.pattern = column.property.pattern
  }

  if (column.property.minLength !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.minLength = column.property.minLength
  }

  if (column.property.maxLength !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.maxLength = column.property.maxLength
  }

  if (isRequired) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.required = true
  }

  return field
}

function convertToDateField(
  column: Column & { type: "date" },
  isRequired: boolean,
): FrictionlessDateField {
  const field: FrictionlessDateField = {
    name: column.name,
    type: "date",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.property.temporalFormat) {
    field.format = column.property.temporalFormat
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToTimeField(
  column: Column & { type: "time" },
  isRequired: boolean,
): FrictionlessTimeField {
  const field: FrictionlessTimeField = {
    name: column.name,
    type: "time",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.property.temporalFormat) {
    field.format = column.property.temporalFormat
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToDatetimeField(
  column: Column & { type: "date-time" },
  isRequired: boolean,
): FrictionlessDatetimeField {
  const field: FrictionlessDatetimeField = {
    name: column.name,
    type: "datetime",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.property.temporalFormat) {
    field.format = column.property.temporalFormat
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToDurationField(
  column: Column & { type: "duration" },
  isRequired: boolean,
): FrictionlessDurationField {
  const field: FrictionlessDurationField = {
    name: column.name,
    type: "duration",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToListField(
  column: Column & { type: "list" },
  isRequired: boolean,
): FrictionlessListField {
  const field: FrictionlessListField = {
    name: column.name,
    type: "list",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.property.itemType) {
    field.itemType =
      column.property.itemType === "date-time"
        ? "datetime"
        : column.property.itemType
  }

  if (column.property.delimiter) {
    field.delimiter = column.property.delimiter
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToIntegerField(
  column: Column & { type: "integer" },
  isRequired: boolean,
): FrictionlessIntegerField {
  const field: FrictionlessIntegerField = {
    name: column.name,
    type: "integer",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.property.enum) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.enum = column.property.enum
  }

  if (column.property.minimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.minimum = column.property.minimum
  }

  if (column.property.maximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.maximum = column.property.maximum
  }

  if (column.property.exclusiveMinimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMinimum = column.property.exclusiveMinimum
  }

  if (column.property.exclusiveMaximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMaximum = column.property.exclusiveMaximum
  }

  if (column.property.groupChar) {
    field.groupChar = column.property.groupChar
  }

  if (column.property.withText !== undefined) {
    field.bareNumber = !column.property.withText
  }

  if (isRequired) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.required = true
  }

  return field
}

function convertToNumberField(
  column: Column & { type: "number" },
  isRequired: boolean,
): FrictionlessNumberField {
  const field: FrictionlessNumberField = {
    name: column.name,
    type: "number",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.property.enum) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.enum = column.property.enum
  }

  if (column.property.minimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.minimum = column.property.minimum
  }

  if (column.property.maximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.maximum = column.property.maximum
  }

  if (column.property.exclusiveMinimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMinimum = column.property.exclusiveMinimum
  }

  if (column.property.exclusiveMaximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMaximum = column.property.exclusiveMaximum
  }

  if (isRequired) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.required = true
  }

  return field
}

function convertToBooleanField(
  column: Column & { type: "boolean" },
  isRequired: boolean,
): FrictionlessBooleanField {
  const field: FrictionlessBooleanField = {
    name: column.name,
    type: "boolean",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.property.trueValues) {
    field.trueValues = column.property.trueValues
  }

  if (column.property.falseValues) {
    field.falseValues = column.property.falseValues
  }

  if (isRequired) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.required = true
  }

  return field
}

function convertToArrayField(
  column: Column & { type: "array" },
  isRequired: boolean,
): FrictionlessArrayField {
  const field: FrictionlessArrayField = {
    name: column.name,
    type: "array",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToObjectField(
  column: Column & { type: "object" },
  isRequired: boolean,
): FrictionlessObjectField {
  const field: FrictionlessObjectField = {
    name: column.name,
    type: "object",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToGeojsonField(
  column: Column & { type: "geojson" | "topojson" },
  isRequired: boolean,
): FrictionlessGeojsonField {
  const field: FrictionlessGeojsonField = {
    name: column.name,
    type: "geojson",
  }

  if (column.property.title) {
    field.title = column.property.title
  }

  if (column.property.description) {
    field.description = column.property.description
  }

  if (column.property.rdfType) {
    field.rdfType = column.property.rdfType
  }

  if (column.property.missingValues) {
    field.missingValues = column.property.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.type === "topojson") {
    field.format = "topojson"
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

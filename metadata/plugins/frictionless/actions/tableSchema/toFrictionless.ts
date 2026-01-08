import type { Column } from "../../../../models/column/column.ts"
import type { TableSchema } from "../../../../models/tableSchema.ts"
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
import type { FrictionlessYearField } from "../../models/field/year.ts"
import type { FrictionlessSchema } from "../../models/schema.ts"

export function convertTableSchemaToFrictionless(
  tableSchema: TableSchema,
): FrictionlessSchema {
  const fields: FrictionlessField[] = []
  const requiredSet = new Set(tableSchema.required ?? [])

  for (const [name, column] of Object.entries(tableSchema.properties)) {
    const field = convertColumnToField(name, column, requiredSet.has(name))
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
  name: string,
  column: Column,
  isRequired: boolean,
): FrictionlessField {
  if (column.type === "string") {
    if (column.format === "date") {
      return convertToDateField(name, column, isRequired)
    }
    if (column.format === "time") {
      return convertToTimeField(name, column, isRequired)
    }
    if (column.format === "date-time") {
      return convertToDatetimeField(name, column, isRequired)
    }
    if (column.format === "duration") {
      return convertToDurationField(name, column, isRequired)
    }
    if (column.format === "list") {
      return convertToListField(name, column, isRequired)
    }
    return convertToStringField(name, column, isRequired)
  }

  if (column.type === "integer") {
    if (column.format === "year") {
      return convertToYearField(name, column, isRequired)
    }
    return convertToIntegerField(name, column, isRequired)
  }

  if (column.type === "number") {
    return convertToNumberField(name, column, isRequired)
  }

  if (column.type === "boolean") {
    return convertToBooleanField(name, column, isRequired)
  }

  if (column.type === "array") {
    return convertToArrayField(name, column, isRequired)
  }

  if (column.type === "object") {
    if (column.format === "geojson" || column.format === "topojson") {
      return convertToGeojsonField(name, column, isRequired)
    }
    return convertToObjectField(name, column, isRequired)
  }

  throw new Error(`Unsupported column type: ${(column as Column).type}`)
}

function convertToStringField(
  name: string,
  column: Column & { type: "string" },
  isRequired: boolean,
): FrictionlessStringField {
  const field: FrictionlessStringField = {
    name,
    type: "string",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (
    column.format === "email" ||
    column.format === "url" ||
    column.format === "base64" ||
    column.format === "uuid"
  ) {
    field.format =
      column.format === "url"
        ? "uri"
        : column.format === "base64"
          ? "binary"
          : column.format
  }

  if (column.enum) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.enum = column.enum
  }

  if (column.pattern) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.pattern = column.pattern
  }

  if (column.minLength !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.minLength = column.minLength
  }

  if (column.maxLength !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.maxLength = column.maxLength
  }

  if (column.categories && column.categories.length > 0) {
    const firstItem = column.categories[0]
    if (typeof firstItem === "string") {
      const allStrings = column.categories.every(cat => typeof cat === "string")
      if (allStrings) {
        field.categories = column.categories as string[]
      }
    } else if (typeof firstItem === "object") {
      const allObjects = column.categories.every(cat => typeof cat === "object")
      if (allObjects) {
        field.categories = column.categories as {
          value: string
          label: string
        }[]
      }
    }
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
  name: string,
  column: Column & { type: "string"; format: "date" },
  isRequired: boolean,
): FrictionlessDateField {
  const field: FrictionlessDateField = {
    name,
    type: "date",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.temporalFormat) {
    field.format = column.temporalFormat
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToTimeField(
  name: string,
  column: Column & { type: "string"; format: "time" },
  isRequired: boolean,
): FrictionlessTimeField {
  const field: FrictionlessTimeField = {
    name,
    type: "time",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.temporalFormat) {
    field.format = column.temporalFormat
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToDatetimeField(
  name: string,
  column: Column & { type: "string"; format: "date-time" },
  isRequired: boolean,
): FrictionlessDatetimeField {
  const field: FrictionlessDatetimeField = {
    name,
    type: "datetime",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.temporalFormat) {
    field.format = column.temporalFormat
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToDurationField(
  name: string,
  column: Column & { type: "string"; format: "duration" },
  isRequired: boolean,
): FrictionlessDurationField {
  const field: FrictionlessDurationField = {
    name,
    type: "duration",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
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
  name: string,
  column: Column & { type: "string"; format: "list" },
  isRequired: boolean,
): FrictionlessListField {
  const field: FrictionlessListField = {
    name,
    type: "list",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.itemType) {
    field.itemType = column.itemType
  }

  if (column.delimiter) {
    field.delimiter = column.delimiter
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

function convertToIntegerField(
  name: string,
  column: Column & { type: "integer" },
  isRequired: boolean,
): FrictionlessIntegerField {
  const field: FrictionlessIntegerField = {
    name,
    type: "integer",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.enum) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.enum = column.enum
  }

  if (column.minimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.minimum = column.minimum
  }

  if (column.maximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.maximum = column.maximum
  }

  if (column.exclusiveMinimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMinimum = column.exclusiveMinimum
  }

  if (column.exclusiveMaximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMaximum = column.exclusiveMaximum
  }

  if (column.groupChar) {
    field.groupChar = column.groupChar
  }

  if (column.withText !== undefined) {
    field.bareNumber = !column.withText
  }

  if (column.categories && column.categories.length > 0) {
    const firstItem = column.categories[0]
    if (typeof firstItem === "number") {
      const allNumbers = column.categories.every(cat => typeof cat === "number")
      if (allNumbers) {
        field.categories = column.categories as number[]
      }
    } else if (typeof firstItem === "object") {
      const allObjects = column.categories.every(cat => typeof cat === "object")
      if (allObjects) {
        field.categories = column.categories as {
          value: number
          label: string
        }[]
      }
    }
  }

  if (isRequired) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.required = true
  }

  return field
}

function convertToYearField(
  name: string,
  column: Column & { type: "integer"; format: "year" },
  isRequired: boolean,
): FrictionlessYearField {
  const field: FrictionlessYearField = {
    name,
    type: "year",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.enum) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.enum = column.enum
  }

  if (column.minimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.minimum = column.minimum
  }

  if (column.maximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.maximum = column.maximum
  }

  if (column.exclusiveMinimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMinimum = column.exclusiveMinimum
  }

  if (column.exclusiveMaximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMaximum = column.exclusiveMaximum
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
  name: string,
  column: Column & { type: "number" },
  isRequired: boolean,
): FrictionlessNumberField {
  const field: FrictionlessNumberField = {
    name,
    type: "number",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.enum) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.enum = column.enum
  }

  if (column.minimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.minimum = column.minimum
  }

  if (column.maximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.maximum = column.maximum
  }

  if (column.exclusiveMinimum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMinimum = column.exclusiveMinimum
  }

  if (column.exclusiveMaximum !== undefined) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.exclusiveMaximum = column.exclusiveMaximum
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
  name: string,
  column: Column & { type: "boolean" },
  isRequired: boolean,
): FrictionlessBooleanField {
  const field: FrictionlessBooleanField = {
    name,
    type: "boolean",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.enum) {
    if (!field.constraints) {
      field.constraints = {}
    }
    field.constraints.enum = column.enum
  }

  if (column.trueValues) {
    field.trueValues = column.trueValues
  }

  if (column.falseValues) {
    field.falseValues = column.falseValues
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
  name: string,
  column: Column & { type: "array" },
  isRequired: boolean,
): FrictionlessArrayField {
  const field: FrictionlessArrayField = {
    name,
    type: "array",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
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
  name: string,
  column: Column & { type: "object" },
  isRequired: boolean,
): FrictionlessObjectField {
  const field: FrictionlessObjectField = {
    name,
    type: "object",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
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
  name: string,
  column: Column & { type: "object"; format: "geojson" | "topojson" },
  isRequired: boolean,
): FrictionlessGeojsonField {
  const field: FrictionlessGeojsonField = {
    name,
    type: "geojson",
  }

  if (column.title) {
    field.title = column.title
  }

  if (column.description) {
    field.description = column.description
  }

  if (column.rdfType) {
    field.rdfType = column.rdfType
  }

  if (column.missingValues) {
    field.missingValues = column.missingValues.map(v =>
      typeof v === "string" ? v : String(v),
    )
  }

  if (column.format === "topojson") {
    field.format = "topojson"
  }

  if (isRequired) {
    field.constraints = {
      required: true,
    }
  }

  return field
}

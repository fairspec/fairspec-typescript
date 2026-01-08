import { describe, expect, it } from "vitest"
import type { TableSchema } from "../../../../models/tableSchema.ts"
import type { FrictionlessSchema } from "../../models/schema.ts"
import { convertTableSchemaToFrictionless } from "./toFrictionless.ts"

describe("convertTableSchemaToFrictionless", () => {
  it("should convert basic string columns to fields", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        id: {
          type: "string",
          title: "Identifier",
          description: "Unique identifier",
        },
        email: {
          type: "string",
          format: "email",
          title: "Email Address",
        },
      },
      required: ["id"],
    }

    const frictionlessSchema: FrictionlessSchema = {
      fields: [
        {
          name: "id",
          type: "string",
          title: "Identifier",
          description: "Unique identifier",
          constraints: {
            required: true,
          },
        },
        {
          name: "email",
          type: "string",
          format: "email",
          title: "Email Address",
        },
      ],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })

  it("should convert numeric columns with constraints", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        age: {
          type: "integer",
          title: "Age",
          minimum: 0,
          maximum: 150,
        },
        price: {
          type: "number",
          minimum: 0.0,
        },
      },
    }

    const frictionlessSchema: FrictionlessSchema = {
      fields: [
        {
          name: "age",
          type: "integer",
          title: "Age",
          constraints: {
            minimum: 0,
            maximum: 150,
          },
        },
        {
          name: "price",
          type: "number",
          constraints: {
            minimum: 0.0,
          },
        },
      ],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })

  it("should convert foreign keys and primary keys", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        id: {
          type: "string",
        },
        user_id: {
          type: "string",
        },
      },
      primaryKey: ["id"],
      foreignKeys: [
        {
          columns: ["user_id"],
          reference: {
            resource: "users",
            columns: ["id"],
          },
        },
      ],
    }

    const frictionlessSchema: FrictionlessSchema = {
      fields: [
        {
          name: "id",
          type: "string",
        },
        {
          name: "user_id",
          type: "string",
        },
      ],
      primaryKey: ["id"],
      foreignKeys: [
        {
          fields: ["user_id"],
          reference: {
            resource: "users",
            fields: ["id"],
          },
        },
      ],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })

  it("should convert temporal fields", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        created_date: {
          type: "string",
          format: "date",
        },
        created_time: {
          type: "string",
          format: "time",
        },
        created_at: {
          type: "string",
          format: "date-time",
          temporalFormat: "%Y-%m-%dT%H:%M:%S",
        },
      },
    }

    const frictionlessSchema: FrictionlessSchema = {
      fields: [
        {
          name: "created_date",
          type: "date",
        },
        {
          name: "created_time",
          type: "time",
        },
        {
          name: "created_at",
          type: "datetime",
          format: "%Y-%m-%dT%H:%M:%S",
        },
      ],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })

  it("should convert year and duration fields", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        year: {
          type: "integer",
          format: "year",
        },
        duration: {
          type: "string",
          format: "duration",
        },
      },
    }

    const frictionlessSchema: FrictionlessSchema = {
      fields: [
        {
          name: "year",
          type: "year",
        },
        {
          name: "duration",
          type: "duration",
        },
      ],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })

  it("should convert list and array fields", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        tags: {
          type: "string",
          format: "list",
          itemType: "string",
          delimiter: ",",
        },
        items: {
          type: "array",
        },
      },
    }

    const frictionlessSchema: FrictionlessSchema = {
      fields: [
        {
          name: "tags",
          type: "list",
          itemType: "string",
          delimiter: ",",
        },
        {
          name: "items",
          type: "array",
        },
      ],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })

  it("should convert object and geojson fields", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        metadata: {
          type: "object",
        },
        location: {
          type: "object",
          format: "geojson",
        },
        area: {
          type: "object",
          format: "topojson",
        },
      },
    }

    const frictionlessSchema: FrictionlessSchema = {
      fields: [
        {
          name: "metadata",
          type: "object",
        },
        {
          name: "location",
          type: "geojson",
        },
        {
          name: "area",
          type: "geojson",
          format: "topojson",
        },
      ],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })

  it("should convert boolean fields with true/false values", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        active: {
          type: "boolean",
          trueValues: ["yes", "1"],
          falseValues: ["no", "0"],
        },
      },
    }

    const frictionlessSchema: FrictionlessSchema = {
      fields: [
        {
          name: "active",
          type: "boolean",
          trueValues: ["yes", "1"],
          falseValues: ["no", "0"],
        },
      ],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })

  it("should convert missingValues from mixed types to strings", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        value: {
          type: "number",
        },
      },
      missingValues: ["", "NA", 0, false],
    }

    const frictionlessSchema: FrictionlessSchema = {
      fields: [
        {
          name: "value",
          type: "number",
        },
      ],
      missingValues: ["", "NA", "0", "false"],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })

  it("should preserve title and description at schema level", () => {
    const tableSchema: TableSchema = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      title: "User Table",
      description: "Table containing user information",
      properties: {
        id: {
          type: "string",
        },
      },
    }

    const frictionlessSchema: FrictionlessSchema = {
      title: "User Table",
      description: "Table containing user information",
      fields: [
        {
          name: "id",
          type: "string",
        },
      ],
    }

    const result = convertTableSchemaToFrictionless(tableSchema)
    expect(result).toEqual(frictionlessSchema)
  })
})

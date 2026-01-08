import { describe, expect, it } from "vitest"
import type { TableSchema } from "../../../../models/tableSchema.ts"
import type { FrictionlessSchema } from "../../models/schema.ts"
import { convertTableSchemaFromFrictionless } from "./fromFrictionless.ts"

describe("convertTableSchemaFromFrictionless", () => {
  it("should convert basic string fields to columns", () => {
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

    const result = convertTableSchemaFromFrictionless(frictionlessSchema)
    expect(result).toEqual(tableSchema)
  })

  it("should convert numeric fields with constraints", () => {
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

    const result = convertTableSchemaFromFrictionless(frictionlessSchema)
    expect(result).toEqual(tableSchema)
  })

  it("should convert foreign keys and primary keys", () => {
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

    const result = convertTableSchemaFromFrictionless(frictionlessSchema)
    expect(result).toEqual(tableSchema)
  })
})

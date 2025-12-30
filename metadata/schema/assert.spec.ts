import { describe, expect, expectTypeOf, it } from "vitest"
import { assertSchema } from "./assert.ts"
import type { Schema } from "./Schema.ts"

describe("assertSchema", () => {
  it("returns typed schema when valid", async () => {
    const descriptor = {
      fields: [
        {
          name: "id",
          type: "integer",
        },
        {
          name: "name",
          type: "string",
        },
      ],
      primaryKey: ["id"],
    }

    const schema = await assertSchema(descriptor)

    expectTypeOf(schema).toEqualTypeOf<Schema>()
    expect(schema).toEqual(descriptor)
  })

  it("throws Error when schema is invalid", async () => {
    const descriptor = {
      fields: [
        {
          name: "id",
          type: 123,
        },
      ],
    }

    await expect(assertSchema(descriptor)).rejects.toThrow(Error)
  })
})

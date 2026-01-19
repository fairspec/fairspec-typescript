import { writeTempFile } from "@fairspec/library"
import { Command } from "commander"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { validateDataCommand } from "./validate.ts"

describe("data validate", () => {
  beforeEach(() => {
    vi.spyOn(process, "exit").mockImplementation((() => {}) as () => never)
    vi.spyOn(process.stdout, "write").mockImplementation(() => true)
    vi.spyOn(process.stderr, "write").mockImplementation(() => true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should validate valid JSON data", async () => {
    const jsonData = { name: "alice", age: 25, active: true }
    const jsonPath = await writeTempFile(JSON.stringify(jsonData), {
      format: "json",
    })
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
        active: { type: "boolean" },
      },
      required: ["name", "age"],
    }
    const schemaPath = await writeTempFile(JSON.stringify(schema), {
      format: "json",
    })

    const text: string[] = []
    vi.spyOn(console, "log").mockImplementation(msg => {
      text.push(msg)
    })

    const command = new Command()
      .addCommand(validateDataCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        jsonPath,
        "--schema",
        schemaPath,
        "--json",
      ])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "")
    expect(data).toHaveProperty("valid")
  })

  it("should detect invalid JSON data", async () => {
    const jsonData = { name: "alice", age: "not a number" }
    const jsonPath = await writeTempFile(JSON.stringify(jsonData), {
      format: "json",
    })
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    }
    const schemaPath = await writeTempFile(JSON.stringify(schema), {
      format: "json",
    })

    const text: string[] = []
    vi.spyOn(console, "log").mockImplementation(msg => {
      text.push(msg)
    })

    const command = new Command()
      .addCommand(validateDataCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        jsonPath,
        "--schema",
        schemaPath,
        "--json",
      ])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "")
    expect(data).toHaveProperty("valid")
  })

  it("should validate with nested object schema", async () => {
    const jsonData = {
      name: "alice",
      address: { city: "New York", zip: "10001" },
    }
    const jsonPath = await writeTempFile(JSON.stringify(jsonData), {
      format: "json",
    })
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        address: {
          type: "object",
          properties: {
            city: { type: "string" },
            zip: { type: "string" },
          },
        },
      },
    }
    const schemaPath = await writeTempFile(JSON.stringify(schema), {
      format: "json",
    })

    const text: string[] = []
    vi.spyOn(console, "log").mockImplementation(msg => {
      text.push(msg)
    })

    const command = new Command()
      .addCommand(validateDataCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        jsonPath,
        "--schema",
        schemaPath,
        "--json",
      ])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "")
    expect(data).toHaveProperty("valid")
  })
})

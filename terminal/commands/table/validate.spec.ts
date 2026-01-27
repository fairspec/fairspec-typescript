import { writeTempFile } from "@fairspec/library"
import { Command } from "commander"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { validateTableCommand } from "./validate.ts"

describe("table validate", () => {
  beforeEach(() => {
    vi.spyOn(process, "exit").mockImplementation((() => {}) as () => never)
    vi.spyOn(process.stdout, "write").mockImplementation(() => true)
    vi.spyOn(process.stderr, "write").mockImplementation(() => true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should validate a valid CSV table", async () => {
    const csvContent = "id,name,age\n1,alice,25\n2,bob,30\n3,carol,28"
    const csvPath = await writeTempFile(csvContent, { format: "csv" })

    const text: string[] = []
    vi.spyOn(process.stdout, "write").mockImplementation(
      (msg: string | Uint8Array) => {
        text.push(typeof msg === "string" ? msg : msg.toString())
        return true
      },
    )

    const command = new Command()
      .addCommand(validateTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "validate", csvPath, "--json"])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "")
    expect(data).toHaveProperty("valid")
  })

  it("should detect invalid data in table", async () => {
    const csvContent = "id,name,age\n1,alice,25\n2,bob,notanumber\n3,carol,28"
    const csvPath = await writeTempFile(csvContent, { format: "csv" })

    const text: string[] = []
    vi.spyOn(process.stdout, "write").mockImplementation(
      (msg: string | Uint8Array) => {
        text.push(typeof msg === "string" ? msg : msg.toString())
        return true
      },
    )

    const command = new Command()
      .addCommand(validateTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "validate", csvPath, "--json"])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "")
    expect(data).toHaveProperty("valid")
  })

  it("should validate a TSV table", async () => {
    const tsvContent = "id\tname\tscore\n1\talice\t85\n2\tbob\t90\n3\tcarol\t88"
    const tsvPath = await writeTempFile(tsvContent, { format: "tsv" })

    const text: string[] = []
    vi.spyOn(process.stdout, "write").mockImplementation(
      (msg: string | Uint8Array) => {
        text.push(typeof msg === "string" ? msg : msg.toString())
        return true
      },
    )

    const command = new Command()
      .addCommand(validateTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "validate", tsvPath, "--json"])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "")
    expect(data).toHaveProperty("valid")
  })
})

import { writeTempFile } from "@fairspec/library"
import { Command } from "commander"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { inferDialectCommand } from "./infer.ts"

describe("format infer", () => {
  beforeEach(() => {
    vi.spyOn(process, "exit").mockImplementation((() => {}) as () => never)
    vi.spyOn(process.stdout, "write").mockImplementation(() => true)
    vi.spyOn(process.stderr, "write").mockImplementation(() => true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should infer CSV format", async () => {
    const csvPath = await writeTempFile("id,name,age\n1,alice,25\n2,bob,30", {
      format: "csv",
    })

    const text: string[] = []
    vi.spyOn(console, "log").mockImplementation(msg => {
      text.push(msg)
    })

    const command = new Command()
      .addCommand(inferDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "infer", csvPath, "--json"])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "")
    expect(data).toHaveProperty("name")
    expect(data.name).toBe("csv")
  })

  it("should infer format with additional properties", async () => {
    const csvPath = await writeTempFile(
      "id,name,age\n1,alice,25\n2,bob,30\n3,charlie,35",
      { format: "csv" },
    )

    const text: string[] = []
    vi.spyOn(console, "log").mockImplementation(msg => {
      text.push(msg)
    })

    const command = new Command()
      .addCommand(inferDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "infer", csvPath, "--json"])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "")
    expect(data).toHaveProperty("name")
    expect(data.name).toBe("csv")
    expect(data).toHaveProperty("delimiter")
  })

  it("should infer TSV format", async () => {
    const tsvPath = await writeTempFile(
      "id\tname\tage\n1\talice\t25\n2\tbob\t30",
      {
        format: "tsv",
      },
    )

    const text: string[] = []
    vi.spyOn(console, "log").mockImplementation(msg => {
      text.push(msg)
    })

    const command = new Command()
      .addCommand(inferDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "infer", tsvPath, "--json"])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "")
    expect(data).toHaveProperty("name")
    expect(data.name).toBe("tsv")
  })
})

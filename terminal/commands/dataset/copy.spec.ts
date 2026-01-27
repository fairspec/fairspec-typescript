import { existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { writeTempFile } from "@fairspec/library"
import { Command } from "commander"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { copyDatasetCommand } from "./copy.ts"

// TODO: recover
describe.skip("dataset copy", () => {
  beforeEach(() => {
    vi.spyOn(process, "exit").mockImplementation((() => {}) as () => never)
    vi.spyOn(process.stdout, "write").mockImplementation(() => true)
    vi.spyOn(process.stderr, "write").mockImplementation(() => true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should copy a dataset with a single resource", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob", {
      format: "csv",
    })
    const descriptor = {
      resources: [{ path: csvPath }],
    }
    const descriptorPath = await writeTempFile(JSON.stringify(descriptor), {
      format: "json",
    })
    const targetPath = join(
      tmpdir(),
      `dataset-copy-${Math.random().toString(36).slice(2)}`,
    )

    const text: string[] = []
    vi.spyOn(process.stdout, "write").mockImplementation(
      (msg: string | Uint8Array) => {
        text.push(typeof msg === "string" ? msg : msg.toString())
        return true
      },
    )

    const command = new Command()
      .addCommand(copyDatasetCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "copy",
        descriptorPath,
        "--to-path",
        targetPath,
        "--json",
      ])
    } catch {}

    expect(text.length).toBeGreaterThan(0)
    const data = JSON.parse(text[0] ?? "{}")
    expect(data).not.toHaveProperty("error")
  })

  it("should copy a dataset with multiple resources", async () => {
    const csv1Path = await writeTempFile("id,name\n1,alice", {
      format: "csv",
    })
    const csv2Path = await writeTempFile("id,age\n1,25", { format: "csv" })
    const descriptor = {
      resources: [{ path: csv1Path }, { path: csv2Path }],
    }
    const descriptorPath = await writeTempFile(JSON.stringify(descriptor), {
      format: "json",
    })
    const targetPath = join(
      tmpdir(),
      `dataset-copy-${Math.random().toString(36).slice(2)}`,
    )

    const text: string[] = []
    vi.spyOn(process.stdout, "write").mockImplementation(
      (msg: string | Uint8Array) => {
        text.push(typeof msg === "string" ? msg : msg.toString())
        return true
      },
    )

    const command = new Command()
      .addCommand(copyDatasetCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "copy",
        descriptorPath,
        "--to-path",
        targetPath,
        "--json",
      ])
    } catch {}

    expect(existsSync(`${targetPath}/datapackage.json`)).toBe(true)
  })

  it("should copy a dataset from inline data", async () => {
    const descriptor = {
      resources: [
        {
          name: "data",
          data: [
            { id: 1, name: "alice" },
            { id: 2, name: "bob" },
          ],
        },
      ],
    }
    const descriptorPath = await writeTempFile(JSON.stringify(descriptor), {
      format: "json",
    })
    const targetPath = join(
      tmpdir(),
      `dataset-copy-${Math.random().toString(36).slice(2)}`,
    )

    const text: string[] = []
    vi.spyOn(process.stdout, "write").mockImplementation(
      (msg: string | Uint8Array) => {
        text.push(typeof msg === "string" ? msg : msg.toString())
        return true
      },
    )

    const command = new Command()
      .addCommand(copyDatasetCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "copy",
        descriptorPath,
        "--to-path",
        targetPath,
        "--json",
      ])
    } catch {}

    expect(existsSync(`${targetPath}/dataset.json`)).toBe(true)
  })
})

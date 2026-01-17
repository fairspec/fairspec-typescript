import type { Resource } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as loadModule from "./actions/table/load.ts"
import * as saveModule from "./actions/table/save.ts"
import { XlsxPlugin } from "./plugin.ts"

vi.mock("./actions/table/load.ts", () => ({
  loadXlsxTable: vi.fn(),
}))

vi.mock("./actions/table/save.ts", () => ({
  saveXlsxTable: vi.fn(),
}))

describe("XlsxPlugin", () => {
  let plugin: XlsxPlugin
  let mockLoadXlsxTable: ReturnType<typeof vi.fn>
  let mockSaveXlsxTable: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new XlsxPlugin()
    mockLoadXlsxTable = vi.mocked(loadModule.loadXlsxTable)
    mockSaveXlsxTable = vi.mocked(saveModule.saveXlsxTable)
    vi.clearAllMocks()
  })

  describe("loadTable", () => {
    it("should load table from xlsx file", async () => {
      const resource: Resource = {
        data: "test.xlsx",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadXlsxTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadXlsxTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should return undefined for non-xlsx files", async () => {
      const resource: Resource = {
        data: "test.csv",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadXlsxTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const resource: Resource = {
        data: "test.txt",
        format: { name: "xlsx" },
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadXlsxTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadXlsxTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should pass through load options", async () => {
      const resource: Resource = {
        data: "test.xlsx",
      }
      const options = { denormalized: true }
      const mockTable = pl.DataFrame().lazy()
      mockLoadXlsxTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource, options)

      expect(mockLoadXlsxTable).toHaveBeenCalledWith(resource, options)
    })

    it("should handle paths with directories", async () => {
      const resource: Resource = {
        data: "/path/to/data.xlsx",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadXlsxTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource)

      expect(mockLoadXlsxTable).toHaveBeenCalledWith(resource, undefined)
    })

    it("should return undefined for ods files", async () => {
      const resource: Resource = {
        data: "test.ods",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadXlsxTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for json files", async () => {
      const resource: Resource = {
        data: "test.json",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadXlsxTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe("saveTable", () => {
    it("should save table to xlsx file", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.xlsx" }
      mockSaveXlsxTable.mockResolvedValue("output.xlsx")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveXlsxTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.xlsx")
    })

    it("should return undefined for non-xlsx files", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.csv" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveXlsxTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.txt", format: { name: "xlsx" as const } }
      mockSaveXlsxTable.mockResolvedValue("output.txt")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveXlsxTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.txt")
    })

    it("should handle paths with directories", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "/path/to/output.xlsx" }
      mockSaveXlsxTable.mockResolvedValue("/path/to/output.xlsx")

      await plugin.saveTable(table, options)

      expect(mockSaveXlsxTable).toHaveBeenCalledWith(table, options)
    })

    it("should return undefined for files without extension", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveXlsxTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for ods files", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.ods" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveXlsxTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for json files", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.json" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveXlsxTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})

import { beforeEach, describe, expect, it, vi } from "vitest"
import * as fetchModule from "./fetch.ts"
import { inferHash } from "./infer.ts"
import { writeTempFile } from "./temp.ts"
import { validateFile } from "./validate.ts"

vi.mock("./fetch.ts", () => ({
  prefetchFiles: vi.fn(),
}))

describe("validateFile", () => {
  let mockPrefetchFiles: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockPrefetchFiles = vi.mocked(fetchModule.prefetchFiles)
    vi.clearAllMocks()
  })

  it("should return valid report when no validation options provided", async () => {
    const report = await validateFile({ data: "https://example.com/file.txt" })

    expect(mockPrefetchFiles).not.toHaveBeenCalled()
    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate encoding successfully when it matches", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile({
      data: "https://example.com/file.txt",
      encoding: "utf-8",
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should return error when utf-8 content is expected to be ascii", async () => {
    const buffer = Buffer.from("Héllo, Wörld! 你好 مرحبا", "utf-8")
    const tempFilePath = await writeTempFile(buffer)
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile({
      data: "https://example.com/file.txt",
      encoding: "ascii",
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(1)
    expect(report.errors[0]?.type).toBe("file/encoding")
    expect(report.errors[0]).toMatchObject({
      type: "file/encoding",
      expectedEncoding: "ascii",
      actualEncoding: "utf-8",
    })
  })

  it("should pass when ascii content is validated as utf-8", async () => {
    const buffer = Buffer.from("Simple ASCII text only", "ascii")
    const tempFilePath = await writeTempFile(buffer)
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile({
      data: "https://example.com/file.txt",
      encoding: "utf-8",
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate integrity successfully when it matches", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "md5" },
    )

    const report = await validateFile({
      data: "https://example.com/file.txt",
      integrity: {
        type: "md5",
        hash: actualHash,
      },
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should return error when integrity hash does not match", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "md5" },
    )

    const report = await validateFile({
      data: "https://example.com/file.txt",
      integrity: {
        type: "md5",
        hash: "wronghash",
      },
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(1)
    expect(report.errors[0]).toEqual({
      type: "file/integrity",
      hashType: "md5",
      expectedHash: "wronghash",
      actualHash,
    })
  })

  it("should validate sha256 integrity", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "sha256" },
    )

    const report = await validateFile({
      data: "https://example.com/file.txt",
      integrity: {
        type: "sha256",
        hash: actualHash,
      },
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate sha1 integrity", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "sha1" },
    )

    const report = await validateFile({
      data: "https://example.com/file.txt",
      integrity: {
        type: "sha1",
        hash: actualHash,
      },
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate sha512 integrity", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "sha512" },
    )

    const report = await validateFile({
      data: "https://example.com/file.txt",
      integrity: {
        type: "sha512",
        hash: actualHash,
      },
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate both encoding and integrity when both match", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "md5" },
    )

    const report = await validateFile({
      data: "https://example.com/file.txt",
      encoding: "utf-8",
      integrity: {
        type: "md5",
        hash: actualHash,
      },
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should return multiple errors when both encoding and integrity do not match", async () => {
    const buffer = Buffer.from("Héllo, Wörld! 你好 مرحبا", "utf-8")
    const tempFilePath = await writeTempFile(buffer)
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "md5" },
    )

    const report = await validateFile({
      data: "https://example.com/file.txt",
      encoding: "ascii",
      integrity: {
        type: "md5",
        hash: "wronghash",
      },
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(2)
    expect(report.errors[0]?.type).toBe("file/encoding")
    expect(report.errors[0]?.expectedEncoding).toBe("ascii")
    expect(report.errors[0]?.actualEncoding).toBe("utf-8")
    expect(report.errors[1]?.type).toBe("file/integrity")
    expect(report.errors[1]?.hashType).toBe("md5")
    expect(report.errors[1]?.expectedHash).toBe("wronghash")
    expect(report.errors[1]?.actualHash).toBe(actualHash)
  })

  it("should return error when only encoding mismatch", async () => {
    const buffer = Buffer.from("Héllo, Wörld! 你好 مرحبا", "utf-8")
    const tempFilePath = await writeTempFile(buffer)
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "md5" },
    )

    const report = await validateFile({
      data: "https://example.com/file.txt",
      encoding: "utf-8",
      integrity: {
        type: "md5",
        hash: actualHash,
      },
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(1)
    expect(report.errors[0]?.type).toBe("file/encoding")
  })

  it("should return error when only integrity mismatch", async () => {
    const tempFilePath = await writeTempFile("Hello, World!")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile({
      data: "https://example.com/file.txt",
      encoding: "utf-8",
      integrity: {
        type: "md5",
        hash: "wronghash",
      },
    })

    expect(report.valid).toBe(false)
    expect(report.errors).toHaveLength(1)
    expect(report.errors[0]?.type).toBe("file/integrity")
  })

  it("should handle local file paths", async () => {
    const tempFilePath = await writeTempFile("x".repeat(2048))
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "sha256" },
    )

    const report = await validateFile({
      data: "/local/path/file.txt",
      integrity: {
        type: "sha256",
        hash: actualHash,
      },
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should handle empty file validation", async () => {
    const tempFilePath = await writeTempFile("")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const actualHash = await inferHash(
      { data: tempFilePath },
      { hashType: "sha256" },
    )

    const report = await validateFile({
      data: "https://example.com/empty.txt",
      integrity: {
        type: "sha256",
        hash: actualHash,
      },
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })

  it("should validate ascii encoding", async () => {
    const tempFilePath = await writeTempFile("Simple ASCII text")
    mockPrefetchFiles.mockResolvedValue([tempFilePath])

    const report = await validateFile({
      data: "https://example.com/ascii.txt",
      encoding: "utf-8",
    })

    expect(report).toEqual({ valid: true, errors: [] })
  })
})

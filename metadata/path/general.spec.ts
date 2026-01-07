import { describe, expect, it } from "vitest"
import { getFileExtension, getFileName, isRemotePath } from "./general.ts"

describe("isRemotePath", () => {
  it.each([
    {
      description: "http URL",
      path: "http://example.com/path/to/file.txt",
      isRemote: true,
    },
    {
      description: "https URL",
      path: "https://example.com/path/to/file.txt",
      isRemote: true,
    },
    {
      description: "ftp URL",
      path: "ftp://example.com/path/to/file.txt",
      isRemote: true,
    },
    {
      description: "file URL",
      path: "file:///path/to/file.txt",
      isRemote: false,
    },
    {
      description: "absolute path",
      path: "/path/to/file.txt",
      isRemote: false,
    },
    {
      description: "relative path",
      path: "path/to/file.txt",
      isRemote: false,
    },
    {
      description: "current directory path",
      path: "./file.txt",
      isRemote: false,
    },
    {
      description: "parent directory path",
      path: "../file.txt",
      isRemote: false,
    },
    {
      description: "empty string",
      path: "",
      isRemote: false,
    },
    {
      // new URL considers this to be a valid URL
      description: "protocol without slashes",
      path: "http:example.com",
      isRemote: true,
    },
  ])("$description", ({ path, isRemote }) => {
    expect(isRemotePath(path)).toBe(isRemote)
  })
})

describe("getFileName", () => {
  it.each([
    {
      description: "simple filename",
      path: "file.txt",
      filename: "file.txt",
    },
    {
      description: "directory path with filename",
      path: "some/path/to/file.txt",
      filename: "file.txt",
    },
    {
      description: "remote HTTP URL",
      path: "http://example.com/path/to/file.txt",
      filename: "file.txt",
    },
    {
      description: "remote HTTPS URL",
      path: "https://example.com/path/to/file.txt",
      filename: "file.txt",
    },
    {
      description: "URL with query parameters",
      path: "https://example.com/path/to/file.txt?query=param",
      filename: "file.txt",
    },
    {
      description: "URL with hash",
      path: "https://example.com/path/to/file.txt#section",
      filename: "file.txt",
    },
    {
      description: "URL with query and hash",
      path: "https://example.com/path/to/file.txt?query=param#section",
      filename: "file.txt",
    },
    {
      description: "URL with no filename",
      path: "https://example.com/path/",
      filename: undefined,
    },
    {
      description: "local path with no filename",
      path: "some/path/",
      filename: undefined,
    },
  ])("$description", ({ path, filename }) => {
    expect(getFileName(path)).toEqual(filename)
  })
})

describe("getFileExtension", () => {
  it("infers format from single string path", () => {
    expect(getFileExtension("/data/users.csv")).toBe("csv")
  })

  it("infers format from URL path", () => {
    expect(getFileExtension("https://example.com/data/products.json")).toBe(
      "json",
    )
  })

  it("returns lowercase format", () => {
    expect(getFileExtension("/data/file.CSV")).toBe("csv")
  })

  it("returns format name even for unsupported extensions", () => {
    expect(getFileExtension("/data/file.tar.gz")).toBe("gz")
  })

  it("returns undefined when path has no extension", () => {
    expect(getFileExtension("/data/file")).toBeUndefined()
  })

  it("returns undefined when filename cannot be determined", () => {
    expect(getFileExtension("/data/folder/")).toBeUndefined()
  })

  it("handles multiple extensions", () => {
    expect(getFileExtension("/data/file.backup.csv")).toBe("csv")
  })

  it("handles hidden files with extension", () => {
    expect(getFileExtension("/data/.gitignore")).toBe("gitignore")
  })

  it("handles URL with query parameters", () => {
    expect(getFileExtension("https://example.com/file.json?key=value")).toBe(
      "json",
    )
  })

  it("handles URL with hash", () => {
    expect(getFileExtension("https://example.com/file.pdf#page=1")).toBe("pdf")
  })
})

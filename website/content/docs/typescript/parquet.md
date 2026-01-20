---
title: Working with Parquet
sidebar:
  label: Parquet
  order: 6
---

The `@fairspec/table` package provides efficient support for loading and saving data in Apache Parquet format. It uses Polars DataFrames for high-performance columnar data processing.

## Installation

```bash
npm install @fairspec/table
```

## Basic Usage

### Loading Data

```typescript
import { loadParquetTable } from "@fairspec/table"

// Load from local file
const table = await loadParquetTable({ path: "data.parquet" })

// Load from remote URL
const table = await loadParquetTable({
  path: "https://example.com/data.parquet"
})

// Load multiple files (concatenated)
const table = await loadParquetTable({
  path: ["file1.parquet", "file2.parquet"]
})
```

### Saving Data

```typescript
import { saveParquetTable } from "@fairspec/table"

// Save as Parquet format
await saveParquetTable(table, { path: "output.parquet" })
```

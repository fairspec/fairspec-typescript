---
title: Working with Tabular Data in TypeScript
sidebar:
  label: Tabular Data
  order: 11
---

High-performance data processing and schema validation for tabular data built on **nodejs-polars** (a Rust-based DataFrame library).

## Installation

```bash
npm install fairspec
```

## Getting Started

The table package provides core utilities for working with tabular data:

- `normalizeTable` - Convert table data to match a schema
- `denormalizeTable` - Convert normalized data back to raw format
- `inferTableSchemaFromTable` - Automatically infer schema from table data
- `inspectTable` - Get table structure information
- `queryTable` - Query tables using SQL-like syntax

For example:

```typescript
import { loadCsvTable, inferTableSchemaFromTable } from "fairspec"

const table = await loadCsvTable({ data: "data.csv" })
const schema = await inferTableSchemaFromTable(table)
```

## Basic Usage

### Schema Inference

Automatically infer Table Schema from data:

```typescript
import * as pl from "nodejs-polars"
import { inferTableSchemaFromTable } from "fairspec"

// Create a table from data
const table = pl.DataFrame({
  id: ["1", "2", "3"],
  price: ["10.50", "25.00", "15.75"],
  date: ["2023-01-15", "2023-02-20", "2023-03-25"],
  active: ["true", "false", "true"]
}).lazy()

const schema = await inferTableSchemaFromTable(table, {
  sampleRows: 100,      // Sample size for inference
  confidence: 0.9       // Confidence threshold
})

// Result: automatically detected integer, number, date, and boolean types
```

### Table Normalization

Convert table data to match a Table Schema (type conversion):

```typescript
import * as pl from "nodejs-polars"
import { normalizeTable } from "fairspec"
import type { TableSchema } from "fairspec"

// Create table with string data
const table = pl.DataFrame({
  id: ["1", "2", "3"],
  price: ["10.50", "25.00", "15.75"],
  active: ["true", "false", "true"],
  date: ["2023-01-15", "2023-02-20", "2023-03-25"]
}).lazy()

// Define schema
const schema: TableSchema = {
  properties: {
    id: { type: "integer" },
    price: { type: "number" },
    active: { type: "boolean" },
    date: { type: "date" }
  }
}

const normalized = await normalizeTable(table, schema)
const result = await normalized.collect()

// Result has properly typed columns:
// { id: 1, price: 10.50, active: true, date: Date('2023-01-15') }
```

### Table Denormalization

Convert normalized data back to raw format (for saving):

```typescript
import { denormalizeTable } from "fairspec"

// Denormalize for saving (converts dates to strings, etc.)
const denormalized = await denormalizeTable(table, schema, {
  nativeTypes: ["string", "number", "boolean"]
})
```

## Advanced Features

### Working with Table Schema

Define schemas with column properties and constraints:

```typescript
import type { TableSchema } from "fairspec"

const schema: TableSchema = {
  properties: {
    id: {
      type: "integer",
      minimum: 1
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 100
    },
    email: {
      type: "string",
      pattern: "^[^@]+@[^@]+\\.[^@]+$"
    },
    age: {
      type: "integer",
      minimum: 0,
      maximum: 150
    },
    status: {
      type: "string",
      enum: ["active", "inactive", "pending"]
    }
  },
  required: ["id", "name", "email"],
  primaryKey: ["id"]
}
```

### Schema Inference Options

Customize how schemas are inferred:

```typescript
import { inferTableSchemaFromTable } from "fairspec"

const schema = await inferTableSchemaFromTable(table, {
  sampleRows: 100,      // Number of rows to sample
  confidence: 0.9,      // Confidence threshold for type detection
  keepStrings: false,   // Keep original string types
  columnTypes: {        // Override types for specific columns
    id: "integer",
    status: "categorical"
  }
})
```

### Handling Missing Values

Define missing value indicators:

```typescript
const schema: TableSchema = {
  properties: {
    value: { type: "number" }
  },
  missingValues: ["", "N/A", "null", -999]
}
```

### Primary Keys and Constraints

Define table-level constraints:

```typescript
const schema: TableSchema = {
  properties: {
    user_id: { type: "integer" },
    email: { type: "string" }
  },
  primaryKey: ["user_id"],
  uniqueKeys: [
    { columnNames: ["email"] }
  ]
}
```

## Supported Column Types

### Primitive Types
- `string` - Text data
- `integer` - Whole numbers
- `number` - Decimal numbers
- `boolean` - True/false values

### Temporal Types
- `date` - Calendar dates
- `datetime` - Date and time
- `time` - Time of day
- `duration` - Time spans

### Spatial Types
- `geojson` - GeoJSON geometries
- `wkt` - Well-Known Text geometries
- `wkb` - Well-Known Binary geometries

### Complex Types
- `array` - Fixed-length arrays
- `list` - Variable-length lists
- `object` - JSON objects

### Specialized Types
- `email` - Email addresses
- `url` - URLs
- `categorical` - Categorical data
- `base64` - Base64 encoded data
- `hex` - Hexadecimal data

## Table Type

The package uses `LazyDataFrame` from nodejs-polars for efficient processing:

```typescript
import type { Table } from "fairspec"
import * as pl from "nodejs-polars"

// Table is an alias for pl.LazyDataFrame
const table: Table = pl.DataFrame({ id: [1, 2, 3] }).lazy()
```

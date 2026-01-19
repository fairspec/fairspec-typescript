import type {
  CellConstError,
  CellEnumError,
  CellExclusiveMaximumError,
  CellExclusiveMinimumError,
  CellJsonError,
  CellMaxItemsError,
  CellMaximumError,
  CellMaxLengthError,
  CellMinItemsError,
  CellMinimumError,
  CellMinLengthError,
  CellMultipleOfError,
  CellPatternError,
  CellRequiredError,
  CellTypeError,
  CellUniqueError,
  ColumnMissingError,
  ColumnTypeError,
  DataError,
  FairspecError,
  ForeignKeyError,
  IntegrityError,
  MetadataError,
  ResourceMissingError,
  ResourceTypeError,
  RowPrimaryKeyError,
  RowUniqueKeyError,
  TextualError,
} from "@fairspec/library"
import pc from "picocolors"

export function renderError(error: FairspecError) {
  switch (error.type) {
    case "cell/type":
      return renderCellTypeError(error)
    case "cell/required":
      return renderCellRequiredError(error)
    case "cell/minimum":
      return renderCellMinimumError(error)
    case "cell/maximum":
      return renderCellMaximumError(error)
    case "cell/exclusiveMinimum":
      return renderCellExclusiveMinimumError(error)
    case "cell/exclusiveMaximum":
      return renderCellExclusiveMaximumError(error)
    case "cell/multipleOf":
      return renderCellMultipleOfError(error)
    case "cell/minLength":
      return renderCellMinLengthError(error)
    case "cell/maxLength":
      return renderCellMaxLengthError(error)
    case "cell/pattern":
      return renderCellPatternError(error)
    case "cell/unique":
      return renderCellUniqueError(error)
    case "cell/const":
      return renderCellConstError(error)
    case "cell/enum":
      return renderCellEnumError(error)
    case "cell/json":
      return renderCellJsonError(error)
    case "cell/minItems":
      return renderCellMinItemsError(error)
    case "cell/maxItems":
      return renderCellMaxItemsError(error)
    case "column/missing":
      return renderColumnMissingError(error)
    case "column/type":
      return renderColumnTypeError(error)
    case "row/primaryKey":
      return renderRowPrimaryKeyError(error)
    case "row/uniqueKey":
      return renderRowUniqueKeyError(error)
    case "foreignKey":
      return renderForeignKeyError(error)
    case "file/textual":
      return renderTextualError(error)
    case "file/integrity":
      return renderIntegrityError(error)
    case "metadata":
      return renderMetadataError(error)
    case "resource/missing":
      return renderResourceMissingError(error)
    case "resource/type":
      return renderResourceTypeError(error)
    case "data":
      return renderDataError(error)
  }
}

export function renderCellTypeError(error: CellTypeError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const columnType = pc.bold(error.columnType)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} has incorrect type (expected ${columnType})`
}

export function renderCellRequiredError(error: CellRequiredError) {
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)

  return `A required cell in column ${columnName} of row ${rowNumber} is missing`
}

export function renderCellMinimumError(error: CellMinimumError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const minimum = pc.bold(error.minimum)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} is below the minimum value of ${minimum}`
}

export function renderCellMaximumError(error: CellMaximumError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const maximum = pc.bold(error.maximum)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} exceeds the maximum value of ${maximum}`
}

export function renderCellExclusiveMinimumError(
  error: CellExclusiveMinimumError,
) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const minimum = pc.bold(error.minimum)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} must be greater than ${minimum}`
}

export function renderCellExclusiveMaximumError(
  error: CellExclusiveMaximumError,
) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const maximum = pc.bold(error.maximum)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} must be less than ${maximum}`
}

export function renderCellMultipleOfError(error: CellMultipleOfError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const multipleOf = pc.bold(error.multipleOf)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} must be a multiple of ${multipleOf}`
}

export function renderCellMinLengthError(error: CellMinLengthError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const minLength = pc.bold(error.minLength)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} is shorter than the minimum length of ${minLength}`
}

export function renderCellMaxLengthError(error: CellMaxLengthError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const maxLength = pc.bold(error.maxLength)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} exceeds the maximum length of ${maxLength}`
}

export function renderCellPatternError(error: CellPatternError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const pattern = pc.bold(error.pattern)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} does not match the required pattern ${pattern}`
}

export function renderCellUniqueError(error: CellUniqueError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} is not unique`
}

export function renderCellConstError(error: CellConstError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const constValue = pc.bold(error.const)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} must be ${constValue}`
}

export function renderCellEnumError(error: CellEnumError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const enumValues = error.enum.map(v => pc.bold(v)).join(", ")

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} must be one of: ${enumValues}`
}

export function renderCellJsonError(error: CellJsonError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const jsonPointer = pc.bold(error.jsonPointer)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} violates JSON schema at ${jsonPointer}: ${error.message}`
}

export function renderCellMinItemsError(error: CellMinItemsError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const minItems = pc.bold(error.minItems)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} has fewer than the minimum ${minItems} items`
}

export function renderCellMaxItemsError(error: CellMaxItemsError) {
  const cell = pc.bold(error.cell)
  const columnName = pc.bold(error.columnName)
  const rowNumber = pc.bold(error.rowNumber)
  const maxItems = pc.bold(error.maxItems)

  return `Cell ${cell} in column ${columnName} of row ${rowNumber} has more than the maximum ${maxItems} items`
}

export function renderColumnMissingError(error: ColumnMissingError) {
  const columnName = pc.bold(error.columnName)

  return `Required column ${columnName} is missing`
}

export function renderColumnTypeError(error: ColumnTypeError) {
  const columnName = pc.bold(error.columnName)
  const expectedColumnType = pc.bold(error.expectedColumnType)
  const actualColumnType = pc.bold(error.actualColumnType)

  return `Column ${columnName} has incorrect type (expected ${expectedColumnType}, found ${actualColumnType})`
}

export function renderRowPrimaryKeyError(error: RowPrimaryKeyError) {
  const rowNumber = pc.bold(error.rowNumber)
  const columnNames = error.columnNames.map(c => pc.bold(c)).join(", ")

  return `Row ${rowNumber} violates primary key constraint on columns: ${columnNames}`
}

export function renderRowUniqueKeyError(error: RowUniqueKeyError) {
  const rowNumber = pc.bold(error.rowNumber)
  const columnNames = error.columnNames.map(c => pc.bold(c)).join(", ")

  return `Row ${rowNumber} violates unique key constraint on columns: ${columnNames}`
}

export function renderForeignKeyError(error: ForeignKeyError) {
  const cells = error.cells.map(c => pc.bold(c)).join(", ")

  return `Foreign key constraint violated: cells [${cells}] do not reference existing values`
}

export function renderTextualError(error: TextualError) {
  if (error.actualEncoding) {
    const actualEncoding = pc.bold(error.actualEncoding)
    return `File encoding error (expected textual format, found ${actualEncoding})`
  }

  return `File encoding error (expected textual format)`
}

export function renderIntegrityError(error: IntegrityError) {
  const hashType = pc.bold(error.hashType)
  const expectedHash = pc.bold(error.expectedHash)
  const actualHash = pc.bold(error.actualHash)

  return `File integrity check failed: ${hashType} hash mismatch (expected ${expectedHash}, found ${actualHash})`
}

export function renderMetadataError(error: MetadataError) {
  const jsonPointer = pc.bold(error.jsonPointer)

  return `Metadata error at ${jsonPointer}: ${error.message}`
}

export function renderResourceMissingError(error: ResourceMissingError) {
  const resourceName = pc.bold(error.resourceName)

  return `Resource ${resourceName} is missing`
}

export function renderResourceTypeError(error: ResourceTypeError) {
  const expectedResourceType = pc.bold(error.expectedResourceType)

  return `Resource has incorrect type (expected ${expectedResourceType})`
}

export function renderDataError(error: DataError) {
  const jsonPointer = pc.bold(error.jsonPointer)

  return `Data error at ${jsonPointer}: ${error.message}`
}

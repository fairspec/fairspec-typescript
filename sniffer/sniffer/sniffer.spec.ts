import { describe, it, expect } from 'vitest'
import { Sniffer } from './sniffer.ts'

describe('Sniffer', () => {
  it('should detect comma-delimited CSV', () => {
    const csv = 'id,name,age\n1,Alice,25\n2,Bob,30'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.delimiter).toBe(44) // comma
    expect(metadata.dialect.header.hasHeaderRow).toBe(true)
    expect(metadata.numFields).toBe(3)
    expect(metadata.fields).toEqual(['id', 'name', 'age'])
  })

  it('should detect tab-delimited TSV', () => {
    const tsv = 'id\tname\tage\n1\tAlice\t25\n2\tBob\t30'
    const bytes = new TextEncoder().encode(tsv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.delimiter).toBe(9) // tab
    expect(metadata.dialect.header.hasHeaderRow).toBe(true)
    expect(metadata.numFields).toBe(3)
  })

  it('should detect semicolon-delimited CSV', () => {
    const csv = 'id;name;age\n1;Alice;25\n2;Bob;30'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.delimiter).toBe(59) // semicolon
    expect(metadata.numFields).toBe(3)
  })

  it('should detect pipe-delimited CSV', () => {
    const csv = 'id|name|age\n1|Alice|25\n2|Bob|30'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.delimiter).toBe(124) // pipe
    expect(metadata.numFields).toBe(3)
  })

  it('should detect quoted fields', () => {
    const csv = 'id,name,description\n1,"Alice","She said, ""Hello"""\n2,"Bob","Normal text"'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.delimiter).toBe(44)
    expect(metadata.dialect.quote.type).toBe('Some')
    if (metadata.dialect.quote.type === 'Some') {
      expect(metadata.dialect.quote.char).toBe(34) // double quote
    }
  })

  it('should detect CRLF line terminator', () => {
    const csv = 'id,name\r\n1,Alice\r\n2,Bob'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.delimiter).toBe(44)
    expect(metadata.numFields).toBe(2)
  })

  it('should detect CR line terminator', () => {
    const csv = 'id,name\r1,Alice\r2,Bob'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.delimiter).toBe(44)
    expect(metadata.numFields).toBe(2)
  })

  it('should detect CSV without header', () => {
    const csv = '1,Alice,25\n2,Bob,30\n3,Charlie,35'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.header.hasHeaderRow).toBe(false)
    expect(metadata.fields).toEqual(['field_1', 'field_2', 'field_3'])
  })

  it('should skip comment preamble', () => {
    const csv = '# This is a comment\n# Another comment\nid,name\n1,Alice\n2,Bob'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.header.numPreambleRows).toBe(2)
    expect(metadata.fields).toEqual(['id', 'name'])
  })

  it('should detect structural preamble', () => {
    const csv = 'Report Title\nReport Date: 2024-01-01\nid,name\n1,Alice\n2,Bob'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.header.numPreambleRows).toBeGreaterThanOrEqual(1)
  })

  it('should handle UTF-8 BOM', () => {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const csv = new TextEncoder().encode('id,name\n1,Alice')
    const bytes = new Uint8Array([...bom, ...csv])

    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.delimiter).toBe(44)
    expect(metadata.fields).toEqual(['id', 'name'])
  })

  it('should handle flexible mode for variable field counts', () => {
    const csv = 'id,name\n1,Alice\n2,Bob,Extra\n3,Charlie'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.flexible).toBe(true)
  })

  it('should allow forcing delimiter', () => {
    const csv = 'id;name;age\n1;Alice;25\n2;Bob;30'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer().withDelimiter(59)
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.delimiter).toBe(59)
  })

  it('should allow forcing quote character', () => {
    const csv = "id,'name','age'\n1,'Alice','25'"
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer().withQuote({ type: 'Some', char: 39 })
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.dialect.quote.type).toBe('Some')
    if (metadata.dialect.quote.type === 'Some') {
      expect(metadata.dialect.quote.char).toBe(39) // single quote
    }
  })

  it('should calculate average record length', () => {
    const csv = 'id,name\n1,Alice\n2,Bob'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.avgRecordLen).toBeGreaterThan(0)
  })

  it('should handle empty files', () => {
    const csv = ''
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.numFields).toBe(0)
  })

  it('should handle single line files', () => {
    const csv = 'id,name,age'
    const bytes = new TextEncoder().encode(csv)
    const sniffer = new Sniffer()
    const metadata = sniffer.sniffBytes(bytes)

    expect(metadata.numFields).toBe(3)
  })
})

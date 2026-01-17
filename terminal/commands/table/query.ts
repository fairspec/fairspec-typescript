import type { Resource } from "@dpkit/library"
import {
  inferSchemaFromTable,
  loadDialect,
  loadSchema,
  loadTable,
  normalizeTable,
  queryTable,
  resolveSchema,
} from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { Table } from "../../components/Table/index.ts"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import * as params from "../../params/index.ts"
import { createSession, Session } from "../../session.ts"

export const queryTableCommand = new Command()
  .configureHelp(helpConfiguration)
  .description("Explore a table from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromDataset)
  .addOption(params.fromResource)
  .addOption(params.query)
  .addOption(params.debug)

  .optionsGroup("Format")
  .addOption(params.delimiter)
  .addOption(params.lineTerminator)
  .addOption(params.quoteChar)
  .addOption(params.nullSequence)
  .addOption(params.headerRows)
  .addOption(params.headerJoin)
  .addOption(params.commentRows)
  .addOption(params.commentPrefix)
  .addOption(params.columnNames)
  .addOption(params.jsonPointer)
  .addOption(params.rowType)
  .addOption(params.sheetNumber)
  .addOption(params.sheetName)
  .addOption(params.tableName)

  .optionsGroup("Table Schema")
  .addOption(params.schema)
  .addOption(params.columnTypes)
  .addOption(params.missingValues)
  .addOption(params.decimalChar)
  .addOption(params.groupChar)
  .addOption(params.trueValues)
  .addOption(params.falseValues)
  .addOption(params.datetimeFormat)
  .addOption(params.dateFormat)
  .addOption(params.timeFormat)
  .addOption(params.arrayType)
  .addOption(params.listDelimiter)
  .addOption(params.listItemType)
  .addOption(params.sampleRows)
  .addOption(params.confidence)
  .addOption(params.commaDecimal)
  .addOption(params.monthFirst)
  .addOption(params.keepStrings)

  .action(async (path, options) => {
    const session = createSession({
      title: "Explore table",
      debug: options.debug,
    })

    const dialect = options.dialect
      ? await session.task("Loading dialect", loadDialect(options.dialect))
      : createDialectFromOptions(options)

    let schema = options.schema
      ? await session.task("Loading schema", loadSchema(options.schema))
      : undefined

    const resource: Resource = path
      ? { path, dialect, schema }
      : await selectResource(session, options)

    let table = await session.task(
      "Loading table",
      loadTable(resource, { denormalized: true }),
    )

    if (!table) {
      session.terminate("Could not load table")
      process.exit(1)
    }

    if (!schema && resource.schema) {
      schema = await session.task(
        "Loading schema",
        resolveSchema(resource.schema),
      )
    }

    if (!schema) {
      schema = await session.task(
        "Inferring schema",
        inferSchemaFromTable(table, options),
      )
    }

    table = await session.task(
      "Normalizing table",
      normalizeTable(table, schema),
    )

    if (options.query) {
      table = queryTable(table, options.query)
      schema = await inferSchemaFromTable(table)
    }

    await session.render(
      table,
      <Table table={table} schema={schema} withTypes quit={options.quit} />,
    )
  })

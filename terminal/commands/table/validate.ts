import { inspectTable, loadTable } from "@dpkit/library"
import { createReport } from "@dpkit/library"
import { loadSchema } from "@dpkit/library"
import { inferSchemaFromTable, resolveSchema } from "@dpkit/library"
import { loadDialect } from "@dpkit/library"
import type { Resource } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { Report } from "../../components/Report/index.ts"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { selectErrorType } from "../../helpers/error.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import * as params from "../../params/index.ts"
import { createSession, Session } from "../../session.ts"

export const validateTableCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a table from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromDataset)
  .addOption(params.fromResource)
  .addOption(params.debug)
  .addOption(params.json)

  .optionsGroup("Format")
  .addOption(params.delimiter)
  .addOption(params.lineTerminator)
  .addOption(params.quoteChar)
  .addOption(params.nullSequence)
  .addOption(params.headerRows)
  .addOption(params.headerJoin)
  .addOption(params.commentRows)
  .addOption(params.commentChar)
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

  // TODO: Add schema options

  .action(async (path, options) => {
    const session = createSession({
      title: "Validate Table",
      json: options.json,
      debug: options.debug,
      quit: options.quit,
      all: options.all,
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

    const table = await session.task(
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
        resolveSchema(options.schema ?? resource.schema),
      )
    }

    if (!schema) {
      schema = await session.task(
        "Inferring schema",
        inferSchemaFromTable(table, options),
      )
    }

    let errors = await session.task(
      "Inspecting table",
      inspectTable(table, { schema }),
    )

    if (errors.length) {
      const type = await selectErrorType(session, errors)
      if (type) errors = errors.filter(e => e.type === type)
    }

    if (!errors.length) {
      session.success("Table is valid")
      return
    }

    session.render(
      createReport(errors),
      <Report errors={errors} quit={options.quit} />,
    )
  })

import repl from "node:repl"
import type { Resource } from "@dpkit/library"
import * as dpkit from "@dpkit/library"
import { loadDialect, loadSchema, loadTable, queryTable } from "@dpkit/library"
import { Command } from "commander"
import pc from "picocolors"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import * as params from "../../params/index.ts"
import { createSession, Session } from "../../session.ts"

export const scriptTableCommand = new Command("script")
  .configureHelp(helpConfiguration)
  .description(
    "Start a scripting session for a table from a local or remote path",
  )

  .addArgument(params.positionalTablePath)
  .addOption(params.fromDataset)
  .addOption(params.fromResource)
  .addOption(params.debug)
  .addOption(params.query)

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

  .action(async (path, options) => {
    const session = createSession({
      title: "Script table",
      debug: options.debug,
    })

    const dialect = options.dialect
      ? await session.task("Loading dialect", loadDialect(options.dialect))
      : createDialectFromOptions(options)

    const schema = options.schema
      ? await session.task("Loading schema", loadSchema(options.schema))
      : undefined

    const resource: Partial<Resource> = path
      ? { path, dialect, schema }
      : await selectResource(session, options)

    let table = await session.task(
      "Loading table",
      loadTable(resource, options),
    )

    if (!table) {
      session.terminate("Could not load table")
      process.exit(1)
    }

    if (options.query) {
      table = queryTable(table, options.query)
    }

    console.log(
      pc.dim("`dpkit` and `table` variables are available in the session"),
    )

    const replSession = repl.start({ prompt: "dp> " })
    replSession.context.dpkit = dpkit
    replSession.context.table = table
  })

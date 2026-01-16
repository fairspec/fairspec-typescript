import { inferSchemaFromTable, loadTable } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import * as params from "../../../params/index.ts"
import { Session } from "../../../session.ts"
import { Schema } from "../../components/Schema/index.ts"
import { createDialectFromOptions } from "../../helpers/dialect.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"

export const inferTableSchemaCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer a table schema from a table")

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
    const session = Session.create({
      title: "Infer schema",
      json: options.json,
      debug: options.debug,
    })

    const resource = path
      ? { path, dialect: createDialectFromOptions(options) }
      : await selectResource(session, options)

    const table = await session.task(
      "Loading table",
      loadTable(resource, { denormalized: true }),
    )

    if (!table) {
      session.terminate("Could not load table")
      process.exit(1)
    }

    const inferredSchema = await session.task(
      "Inferring schema",
      inferSchemaFromTable(table, options),
    )

    if (isEmptyObject(inferredSchema)) {
      session.terminate("Could not infer schema")
      process.exit(1)
    }

    await session.render(inferredSchema, <Schema schema={inferredSchema} />)
  })

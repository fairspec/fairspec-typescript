import { inferPackage } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { Package } from "../../components/Package/index.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { createSession, Session } from "../../session.ts"

export const inferDatasetCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer a data package from local or remote file paths")

  .addArgument(params.positionalFilePaths)
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

  .action(async (paths, options) => {
    const session = createSession({
      title: "Infer package",
      json: options.json,
      debug: options.debug,
    })

    const sourcePackage = {
      resources: paths.map(path => ({ path })),
    }

    const targetPackage = await session.task(
      "Inferring package",
      inferPackage(sourcePackage, options),
    )

    await session.render(targetPackage, <Package dataPackage={targetPackage} />)
  })

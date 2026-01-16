import { Argument, Option } from "commander"

export const json = new Option("--json", "output as JSON")

export const debug = new Option(
  "--debug",
  "Enable debug mode to print exception details to stderr",
)

export const silent = new Option(
  "--silent",
  "suppress all output except errors",
)

export const optionalPositionalDescriptorPath = new Argument(
  "[path]",
  "local or remote path to the descriptor",
)

export const positionalDescriptorPath = new Argument(
  "<path>",
  "local or remote path to the descriptor",
)

export const positionalTablePath = new Argument(
  "[path]",
  "local or remote path to the table",
)

export const positionalFilePath = new Argument(
  "[path]",
  "local or remote path to the file",
)

export const requiredPositionalFilePath = new Argument(
  "<path>",
  "local or remote path to the file",
)

export const positionalFilePaths = new Argument(
  "<path...>",
  "local paths to files",
)

export const toPath = new Option("--to-path <toPath>", "a local output path")

export const toPathRequired = new Option(
  "--to-path <toPath>",
  "a local output path",
).makeOptionMandatory()

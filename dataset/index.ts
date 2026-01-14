export { copyFile } from "./actions/file/copy.ts"
export { describeFile } from "./actions/file/describe.ts"
export { prefetchFile, prefetchFiles } from "./actions/file/fetch.ts"
export { inferBytes, inferHash, inferTextual } from "./actions/file/infer.ts"
export { loadFile } from "./actions/file/load.ts"
export { assertLocalPathVacant, isLocalPathExist } from "./actions/file/path.ts"
export { saveFile } from "./actions/file/save.ts"
export { getTempFilePath, writeTempFile } from "./actions/file/temp.ts"
export { validateFile } from "./actions/file/validate.ts"
export { getTempFolderPath } from "./actions/folder/temp.ts"
export { loadFileStream } from "./actions/stream/load.ts"

export type {
  DatasetPlugin,
  InferFormatOptions,
  SaveDatasetOptions,
} from "./plugin.ts"
export {
  CkanPlugin,
  loadDatasetFromCkan,
  saveDatasetToCkan,
} from "./plugins/ckan/index.ts"
export { DescriptorPlugin } from "./plugins/descriptor/index.ts"
export {
  FolderPlugin,
  loadDatasetFromFolder,
  saveDatasetToFolder,
} from "./plugins/folder/index.ts"
export {
  GithubPlugin,
  loadDatasetFromGithub,
  saveDatasetToGithub,
} from "./plugins/github/index.ts"
export {
  loadDatasetFromZenodo,
  saveDatasetToZenodo,
  ZenodoPlugin,
} from "./plugins/zenodo/index.ts"
export {
  loadDatasetFromZip,
  saveDatasetToZip,
  ZipPlugin,
} from "./plugins/zip/index.ts"

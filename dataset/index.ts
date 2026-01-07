export {
  assertLocalPathVacant,
  copyFile,
  describeFile,
  getTempFilePath,
  inferBytes,
  inferHash,
  inferTextual,
  isLocalPathExist,
  loadFile,
  prefetchFile,
  prefetchFiles,
  saveFile,
  validateFile,
  writeTempFile,
} from "./file/index.ts"
export { getTempFolderPath } from "./folder/index.ts"
export type { DatasetPlugin, SaveDatasetOptions } from "./plugin.ts"
export {
  CkanPlugin,
  loadPackageFromCkan,
  savePackageToCkan,
} from "./plugins/ckan/index.ts"
export { DescriptorPlugin } from "./plugins/descriptor/index.ts"
export {
  FolderPlugin,
  loadDatasetFromFolder,
  saveDatasetToFolder,
} from "./plugins/folder/index.ts"
export {
  GithubPlugin,
  loadPackageFromGithub,
  savePackageToGithub,
} from "./plugins/github/index.ts"
export {
  loadPackageFromZenodo,
  savePackageToZenodo,
  ZenodoPlugin,
} from "./plugins/zenodo/index.ts"
export {
  loadPackageFromZip,
  savePackageToZip,
  ZipPlugin,
} from "./plugins/zip/index.ts"
export { loadFileStream } from "./stream/index.ts"

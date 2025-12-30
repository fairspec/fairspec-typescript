import { join } from "node:path"
import { loadPackageDescriptor } from "@fairspec/metadata"

export async function loadPackageFromFolder(folderPath: string) {
  return loadPackageDescriptor(join(folderPath, "datapackage.json"))
}

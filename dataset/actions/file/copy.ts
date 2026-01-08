import { loadFileStream } from "../../actions/stream/load.ts"
import { saveFileStream } from "../../actions/stream/save.ts"

export async function copyFile(options: {
  sourcePath: string
  targetPath: string
}) {
  const stream = await loadFileStream(options.sourcePath)
  await saveFileStream(stream, { path: options.targetPath })
}

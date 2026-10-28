import { selectNasrImportOutput } from "./output.mjs";
import { validateNasrImportPaths } from "./paths.mjs";

export function selectNasrImportPaths(inputPath, outputPath, exists) {
  return validateNasrImportPaths(inputPath, selectNasrImportOutput(outputPath), exists);
}

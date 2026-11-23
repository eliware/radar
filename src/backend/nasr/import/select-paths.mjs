import { default as selectNasrImportOutput } from "./output.mjs";
import { default as validateNasrImportPaths } from "./paths.mjs";

function selectNasrImportPaths(inputPath, outputPath, exists) {
  return validateNasrImportPaths(inputPath, selectNasrImportOutput(outputPath), exists);
}
export default selectNasrImportPaths;

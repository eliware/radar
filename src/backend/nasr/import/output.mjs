import { DEFAULT_OUTPUT } from "../output-path.mjs";

function selectNasrImportOutput(outputPath) {
  return outputPath ?? DEFAULT_OUTPUT;
}
export default selectNasrImportOutput;

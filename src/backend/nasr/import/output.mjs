import { DEFAULT_OUTPUT } from "../output-path.mjs";

export function selectNasrImportOutput(outputPath) {
  return outputPath ?? DEFAULT_OUTPUT;
}

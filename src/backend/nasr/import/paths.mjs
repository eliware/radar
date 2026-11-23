import { resolve } from "node:path";
import { default as selectNasrImportOutput } from "./output.mjs";

function selectNasrImportPaths(inputPath, outputPath, exists) {
  const input = resolve(inputPath || "");
  const output = resolve(selectNasrImportOutput(outputPath));
  if (!inputPath || !exists(input)) throw new Error(`Input NASR database not found: ${input}`);
  if (input === output) throw new Error("Input and output NASR database paths must be different.");
  return { input, output };
}
export default selectNasrImportPaths;

import { resolve } from "node:path";
import { selectNasrImportOutput } from "./output.mjs";

export function validateNasrImportPaths(inputPath, outputPath, exists) {
  const input = resolve(inputPath || "");
  const output = resolve(outputPath);
  if (!inputPath || !exists(input)) throw new Error(`Input NASR database not found: ${input}`);
  if (input === output) throw new Error("Input and output NASR database paths must be different.");
  return { input, output };
}

export function selectNasrImportPaths(inputPath, outputPath, exists) {
  return validateNasrImportPaths(inputPath, selectNasrImportOutput(outputPath), exists);
}

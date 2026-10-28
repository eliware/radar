import { DatabaseSync } from "node:sqlite";
import { DEFAULT_OUTPUT } from "../output-path.mjs";
import { createNasrImportFiles } from "./files.mjs";
import { validateNasrImportPaths } from "./paths.mjs";
import { prepareNasrTemporaryDatabase, validateNasrSource } from "./connection-checks.mjs";

export function importNasrDatabaseLifecycle(
  inputPath,
  outputPath = DEFAULT_OUTPUT,
  { Database = DatabaseSync, exists, copy, mkdir, rename, remove } = {},
) {
  const files = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const { input, output } = validateNasrImportPaths(inputPath, outputPath, files.exists);
  validateNasrSource(Database, input);
  files.prepareOutput(output);
  const temporary = files.temporaryPath(output);
  try {
    files.copyInput(input, temporary);
    const indexes = prepareNasrTemporaryDatabase(Database, temporary);
    files.install(temporary, output);
    return { output, indexes };
  } catch (error) {
    files.cleanup(temporary);
    throw error;
  }
}

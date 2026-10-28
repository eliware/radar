import { DatabaseSync } from "node:sqlite";
import { installNasrIndexes } from "../index-installer.mjs";
import { DEFAULT_OUTPUT } from "../output-path.mjs";
import { createNasrImportFiles } from "./files.mjs";
import { validateNasrImportPaths } from "./paths.mjs";
import { validateNasrImportDatabase } from "./validation.mjs";
import { validateNasrDatabase } from "../validation.mjs";

export function importNasrDatabaseLifecycle(
  inputPath,
  outputPath = DEFAULT_OUTPUT,
  { Database = DatabaseSync, exists, copy, mkdir, rename, remove } = {},
) {
  const files = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const { input, output } = validateNasrImportPaths(inputPath, outputPath, files.exists);
  const source = new Database(input, { readOnly: true });
  try {
    validateNasrDatabase(source);
  } finally {
    source.close();
  }
  files.prepareOutput(output);
  const temporary = files.temporaryPath(output);
  try {
    files.copyInput(input, temporary);
    const database = new Database(temporary);
    let indexes;
    try {
      indexes = installNasrIndexes(database);
      validateNasrImportDatabase(database);
    } finally {
      database.close();
    }
    files.install(temporary, output);
    return { output, indexes };
  } catch (error) {
    files.cleanup(temporary);
    throw error;
  }
}

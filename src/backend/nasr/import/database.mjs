import { DatabaseSync } from "node:sqlite";
import { installNasrIndexes } from "../index-installer.mjs";
import { DEFAULT_OUTPUT } from "../output-path.mjs";
import { createNasrImportFiles } from "./files.mjs";
import { validateNasrImportPaths } from "./paths.mjs";
import { validateNasrImportDatabase } from "./validation.mjs";
import { validateNasrDatabase } from "../validation.mjs";
import { withNasrDatabase } from "./connections.mjs";

export function importNasrDatabaseLifecycle(
  inputPath,
  outputPath = DEFAULT_OUTPUT,
  { Database = DatabaseSync, exists, copy, mkdir, rename, remove } = {},
) {
  const files = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const { input, output } = validateNasrImportPaths(inputPath, outputPath, files.exists);
  withNasrDatabase(Database, input, { readOnly: true }, validateNasrDatabase);
  files.prepareOutput(output);
  const temporary = files.temporaryPath(output);
  try {
    files.copyInput(input, temporary);
    const indexes = withNasrDatabase(Database, temporary, undefined, (database) => {
      const count = installNasrIndexes(database);
      validateNasrImportDatabase(database);
      return count;
    });
    files.install(temporary, output);
    return { output, indexes };
  } catch (error) {
    files.cleanup(temporary);
    throw error;
  }
}

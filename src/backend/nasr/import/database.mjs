import { DatabaseSync } from "node:sqlite";
import { DEFAULT_OUTPUT } from "../output-path.mjs";
import { createNasrImportFiles } from "./files.mjs";
import { installNasrCopy } from "./install-copy.mjs";
import { validateNasrImportPaths } from "./paths.mjs";
import { validateNasrSource } from "./connection-checks.mjs";
import { prepareNasrTemporaryDatabase } from "./prepare-database.mjs";

export function importNasrDatabaseLifecycle(
  inputPath,
  outputPath = DEFAULT_OUTPUT,
  { Database = DatabaseSync, exists, copy, mkdir, rename, remove } = {},
) {
  const files = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const { input, output } = validateNasrImportPaths(inputPath, outputPath, files.exists);
  validateNasrSource(Database, input);
  const indexes = installNasrCopy(files, input, output, (temporary) =>
    prepareNasrTemporaryDatabase(Database, temporary),
  );
  return { output, indexes };
}

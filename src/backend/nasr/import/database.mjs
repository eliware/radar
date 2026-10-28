import { DatabaseSync } from "node:sqlite";
import { createNasrImportFiles } from "./files.mjs";
import { installNasrCopy } from "./install-copy.mjs";
import { validateNasrImportPaths } from "./paths.mjs";
import { validateNasrSource } from "./connection-checks.mjs";
import { prepareNasrTemporaryDatabase } from "./prepare-database.mjs";
import { selectNasrImportOutput } from "./output.mjs";

export function importNasrDatabaseLifecycle(
  inputPath,
  outputPath,
  { Database = DatabaseSync, exists, copy, mkdir, rename, remove } = {},
) {
  const files = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const outputSelection = selectNasrImportOutput(outputPath);
  const { input, output } = validateNasrImportPaths(inputPath, outputSelection, files.exists);
  validateNasrSource(Database, input);
  const indexes = installNasrCopy(files, input, output, (temporary) =>
    prepareNasrTemporaryDatabase(Database, temporary),
  );
  return { output, indexes };
}

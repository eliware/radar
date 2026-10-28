import { createNasrImportFiles } from "./files.mjs";
import { installNasrCopy } from "./install-copy.mjs";
import { validateNasrImportPaths } from "./paths.mjs";
import { validateNasrSource } from "./connection-checks.mjs";
import { prepareNasrTemporaryDatabase } from "./prepare-database.mjs";
import { selectNasrImportOutput } from "./output.mjs";
import { selectNasrDatabase } from "./sqlite.mjs";

export function importNasrDatabaseLifecycle(
  inputPath,
  outputPath,
  { Database, exists, copy, mkdir, rename, remove } = {},
) {
  const DatabaseConstructor = selectNasrDatabase(Database);
  const files = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const outputSelection = selectNasrImportOutput(outputPath);
  const { input, output } = validateNasrImportPaths(inputPath, outputSelection, files.exists);
  validateNasrSource(DatabaseConstructor, input);
  const indexes = installNasrCopy(files, input, output, (temporary) =>
    prepareNasrTemporaryDatabase(DatabaseConstructor, temporary),
  );
  return { output, indexes };
}

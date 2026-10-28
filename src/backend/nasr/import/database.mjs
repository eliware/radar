import { createNasrImportFiles } from "./files.mjs";
import { createNasrImportTemporaryFile } from "./temporary-file.mjs";
import { validateNasrImportPaths } from "./paths.mjs";
import { validateNasrSource } from "./connection-checks.mjs";
import { prepareNasrImportInstallation } from "./prepare/install.mjs";
import { selectNasrImportOutput } from "./output.mjs";
import { selectNasrDatabase } from "./sqlite.mjs";

export function importNasrDatabaseLifecycle(
  inputPath,
  outputPath,
  { Database, exists, copy, mkdir, rename, remove } = {},
) {
  const DatabaseConstructor = selectNasrDatabase(Database);
  const filesystem = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const files = createNasrImportTemporaryFile(filesystem);
  const outputSelection = selectNasrImportOutput(outputPath);
  const { input, output } = validateNasrImportPaths(inputPath, outputSelection, filesystem.exists);
  validateNasrSource(DatabaseConstructor, input);
  const indexes = prepareNasrImportInstallation(files, DatabaseConstructor, input, output);
  return { output, indexes };
}

import { createNasrImportFiles } from "./files.mjs";
import { validateNasrImportPaths } from "./paths.mjs";
import { validateNasrSource } from "./source/validation.mjs";
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
  const outputSelection = selectNasrImportOutput(outputPath);
  const { input, output } = validateNasrImportPaths(inputPath, outputSelection, filesystem.exists);
  validateNasrSource(DatabaseConstructor, input);
  const indexes = prepareNasrImportInstallation(filesystem, DatabaseConstructor, input, output);
  return { output, indexes };
}

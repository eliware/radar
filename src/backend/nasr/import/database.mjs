import { validateNasrSource } from "./source/validation.mjs";
import { prepareNasrImportInstallation } from "./prepare/install.mjs";
import { createNasrImportSetup } from "./setup.mjs";

export function importNasrDatabaseLifecycle(
  inputPath,
  outputPath,
  { Database, exists, copy, mkdir, rename, remove } = {},
) {
  const { DatabaseConstructor, filesystem, input, output } = createNasrImportSetup(
    inputPath,
    outputPath,
    { Database, exists, copy, mkdir, rename, remove },
  );
  validateNasrSource(DatabaseConstructor, input);
  const indexes = prepareNasrImportInstallation(filesystem, DatabaseConstructor, input, output);
  return { output, indexes };
}

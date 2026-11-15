import { createNasrImportSetup } from "./setup.mjs";
import { completeNasrImportLifecycle } from "./lifecycle.mjs";

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
  return completeNasrImportLifecycle(DatabaseConstructor, filesystem, input, output);
}

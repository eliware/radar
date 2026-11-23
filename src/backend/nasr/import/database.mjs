import { default as createNasrImportSetup } from "./setup.mjs";
import { default as completeNasrImportLifecycle } from "./lifecycle.mjs";

function importNasrDatabaseLifecycle(
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
export default importNasrDatabaseLifecycle;

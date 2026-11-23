import { default as createNasrImportFiles } from "./files.mjs";
import { default as selectNasrImportPaths } from "./select-paths.mjs";
import { default as selectNasrDatabase } from "./sqlite.mjs";

function createNasrImportSetup(inputPath, outputPath, dependencies) {
  const { Database, exists, copy, mkdir, rename, remove } = dependencies;
  const DatabaseConstructor = selectNasrDatabase(Database);
  const filesystem = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const { input, output } = selectNasrImportPaths(inputPath, outputPath, filesystem.exists);
  return { DatabaseConstructor, filesystem, input, output };
}
export default createNasrImportSetup;

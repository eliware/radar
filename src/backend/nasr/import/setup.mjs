import { createNasrImportFiles } from "./files.mjs";
import { selectNasrImportPaths } from "./select-paths.mjs";
import { selectNasrDatabase } from "./sqlite.mjs";

export function createNasrImportSetup(inputPath, outputPath, dependencies) {
  const { Database, exists, copy, mkdir, rename, remove } = dependencies;
  const DatabaseConstructor = selectNasrDatabase(Database);
  const filesystem = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const { input, output } = selectNasrImportPaths(inputPath, outputPath, filesystem.exists);
  return { DatabaseConstructor, filesystem, input, output };
}

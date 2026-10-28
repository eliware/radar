import { installNasrIndexes } from "../index/installer.mjs";
import { validateNasrDatabase } from "../validation.mjs";
import { validateNasrImportDatabase } from "./validation.mjs";
import { withNasrDatabase } from "./connections.mjs";

export function validateNasrSource(Database, inputPath) {
  return withNasrDatabase(Database, inputPath, { readOnly: true }, validateNasrDatabase);
}

export function prepareNasrTemporaryDatabase(Database, temporaryPath) {
  return withNasrDatabase(Database, temporaryPath, undefined, (database) => {
    const count = installNasrIndexes(database);
    validateNasrImportDatabase(database);
    return count;
  });
}

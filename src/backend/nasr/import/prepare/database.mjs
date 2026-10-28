import { installNasrIndexes } from "../../index/installer.mjs";
import { validateNasrImportDatabase } from "../validation.mjs";
import { validateNasrImportQueryPlans } from "../query-plan-validation.mjs";
import { withNasrDatabase } from "../connections.mjs";

export function prepareNasrTemporaryDatabase(Database, temporaryPath) {
  return withNasrDatabase(Database, temporaryPath, undefined, (database) => {
    const count = installNasrIndexes(database);
    validateNasrImportDatabase(database);
    validateNasrImportQueryPlans(database);
    return count;
  });
}

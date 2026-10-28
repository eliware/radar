import { installNasrIndexes } from "../../index/installer.mjs";
import { validateNasrImportDatabase } from "../validation.mjs";
import { validateNasrImportQueryPlans } from "../query-plan-validation.mjs";
import { withNasrDatabase } from "../connection/lifecycle.mjs";

export function prepareNasrTemporaryDatabase(Database, temporaryPath) {
  return withNasrDatabase(Database, temporaryPath, (database) => {
    const count = installNasrIndexes(database);
    validateNasrImportDatabase(database);
    validateNasrImportQueryPlans(database);
    return count;
  });
}

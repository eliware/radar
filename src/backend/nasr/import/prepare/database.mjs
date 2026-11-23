import { default as installNasrIndexes } from "../../index/installer.mjs";
import { default as validateNasrImportDatabase } from "../validation.mjs";
import { default as validateNasrImportQueryPlans } from "../query-plan-validation.mjs";
import { default as verifyNasrIndexes } from "../../index/validation.mjs";
import { default as withNasrDatabase } from "../connection/lifecycle.mjs";

function prepareNasrTemporaryDatabase(Database, temporaryPath) {
  return withNasrDatabase(Database, temporaryPath, (database) => {
    const count = installNasrIndexes(database);
    validateNasrImportDatabase(database);
    verifyNasrIndexes(database);
    validateNasrImportQueryPlans(database);
    return count;
  });
}
export default prepareNasrTemporaryDatabase;

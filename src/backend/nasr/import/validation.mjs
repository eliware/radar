import { verifyNasrQueryPlans } from "../query/plans.mjs";
import { validateNasrDatabase, verifyNasrIndexes } from "../validation.mjs";

export function validateNasrImportDatabase(database) {
  validateNasrDatabase(database);
  verifyNasrIndexes(database);
  verifyNasrQueryPlans(database);
}

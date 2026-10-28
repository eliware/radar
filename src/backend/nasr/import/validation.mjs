import { verifyNasrIndexes } from "../index/validation.mjs";
import { validateNasrDatabase } from "../validation.mjs";

export function validateNasrImportDatabase(database) {
  validateNasrDatabase(database);
  verifyNasrIndexes(database);
}

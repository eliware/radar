import { withNasrDatabase } from "../connection/lifecycle.mjs";

export function withNasrSourceDatabase(Database, inputPath, operation) {
  return withNasrDatabase(Database, inputPath, { readOnly: true }, operation);
}

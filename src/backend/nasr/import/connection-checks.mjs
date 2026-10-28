import { validateNasrDatabase } from "../validation.mjs";
import { withNasrDatabase } from "./connections.mjs";

export function validateNasrSource(Database, inputPath) {
  return withNasrDatabase(Database, inputPath, { readOnly: true }, validateNasrDatabase);
}

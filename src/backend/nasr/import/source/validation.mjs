import { validateNasrDatabase } from "../../validation.mjs";
import { withNasrSourceDatabase } from "./connection.mjs";

export function validateNasrSource(Database, inputPath) {
  return withNasrSourceDatabase(Database, inputPath, validateNasrDatabase);
}

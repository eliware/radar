import { importNasrDatabaseLifecycle } from "./import/database.mjs";

export function importNasrDatabase(...args) {
  return importNasrDatabaseLifecycle(...args);
}

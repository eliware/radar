import { default as importNasrDatabaseLifecycle } from "./import/database.mjs";

function importNasrDatabase(...args) {
  return importNasrDatabaseLifecycle(...args);
}
export default importNasrDatabase;

import { NASR_INDEXES } from "./definitions.mjs";

export function installNasrIndexes(database) {
  database.exec("BEGIN");
  for (const statement of NASR_INDEXES) database.exec(statement);
  database.exec("COMMIT");
  database.exec("ANALYZE");
  return NASR_INDEXES.length;
}

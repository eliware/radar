import { REQUIRED_COLUMNS } from "./required-columns.mjs";

export function validateNasrDatabase(database) {
  const result = database.prepare("PRAGMA integrity_check").get();
  if (Object.values(result)[0] !== "ok") throw new Error("SQLite integrity check failed.");
  for (const [table, required] of Object.entries(REQUIRED_COLUMNS)) {
    const columns = new Set(
      database
        .prepare(`PRAGMA table_info("${table}")`)
        .all()
        .map((row) => row.name),
    );
    const missing = required.split(" ").filter((column) => !columns.has(column));
    if (missing.length)
      throw new Error(`Invalid NASR database: ${table} is missing ${missing.join(", ")}.`);
  }
}

import { NASR_INDEXES, REQUIRED_COLUMNS } from "./indexes.mjs";

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

export function verifyNasrIndexes(database) {
  const stored = new Map(
    database
      .prepare("SELECT name, sql FROM sqlite_master WHERE type = 'index'")
      .all()
      .map((row) => [row.name, row.sql]),
  );
  for (const statement of NASR_INDEXES) {
    const [, name] = statement.match(/INDEX IF NOT EXISTS (\w+)/);
    const expected = statement
      .replace(" IF NOT EXISTS", "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
    const actual = stored.get(name)?.replace(/\s+/g, " ").trim().toUpperCase();
    if (actual !== expected)
      throw new Error(`NASR index ${name} is missing or has an incorrect definition.`);
  }
}

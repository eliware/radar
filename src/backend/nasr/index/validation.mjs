import { NASR_INDEXES } from "../indexes.mjs";

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

import { NASR_INDEXES } from "./definitions.mjs";
import { normalizeNasrIndexSql, parseNasrIndexDefinition } from "./definition.mjs";

export function verifyNasrIndexes(database) {
  const stored = new Map(
    database
      .prepare("SELECT name, sql FROM sqlite_master WHERE type = 'index'")
      .all()
      .map((row) => [row.name, row.sql]),
  );
  for (const statement of NASR_INDEXES) {
    const { name, definition } = parseNasrIndexDefinition(statement);
    if (normalizeNasrIndexSql(stored.get(name)) !== definition)
      throw new Error(`NASR index ${name} is missing or has an incorrect definition.`);
  }
}

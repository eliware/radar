import { copyFileSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { NASR_INDEXES, REQUIRED_COLUMNS } from "./indexes.mjs";
import { verifyNasrQueryPlans } from "./query-plans.mjs";

const DEFAULT_OUTPUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../nasr/NASR.sqlite",
);

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

export function importNasrDatabase(
  inputPath,
  outputPath = DEFAULT_OUTPUT,
  {
    Database = DatabaseSync,
    exists = existsSync,
    copy = copyFileSync,
    mkdir = mkdirSync,
    rename = renameSync,
    remove = rmSync,
  } = {},
) {
  const input = resolve(inputPath || "");
  const output = resolve(outputPath);
  if (!inputPath || !exists(input)) throw new Error(`Input NASR database not found: ${input}`);
  if (input === output) throw new Error("Input and output NASR database paths must be different.");
  const source = new Database(input, { readOnly: true });
  try {
    validateNasrDatabase(source);
  } finally {
    source.close();
  }
  mkdir(dirname(output), { recursive: true });
  const temporary = `${output}.tmp-${process.pid}`;
  try {
    copy(input, temporary);
    const database = new Database(temporary);
    try {
      database.exec("BEGIN");
      for (const statement of NASR_INDEXES) database.exec(statement);
      database.exec("COMMIT");
      database.exec("ANALYZE");
      validateNasrDatabase(database);
      verifyNasrIndexes(database);
      verifyNasrQueryPlans(database);
    } finally {
      database.close();
    }
    rename(temporary, output);
    return { output, indexes: NASR_INDEXES.length };
  } catch (error) {
    remove(temporary, { force: true });
    throw error;
  }
}

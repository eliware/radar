import { copyFileSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { NASR_INDEXES } from "./indexes.mjs";
import { verifyNasrQueryPlans } from "./query-plans.mjs";
import { validateNasrDatabase, verifyNasrIndexes } from "./validation.mjs";

export { validateNasrDatabase, verifyNasrIndexes } from "./validation.mjs";

const DEFAULT_OUTPUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../nasr/NASR.sqlite",
);

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

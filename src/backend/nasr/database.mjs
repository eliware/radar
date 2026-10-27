import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { NASR_INDEXES } from "./indexes.mjs";
import { DEFAULT_OUTPUT } from "./output-path.mjs";
import { createNasrImportFiles } from "./import-files.mjs";
import { verifyNasrQueryPlans } from "./query-plans.mjs";
import { validateNasrDatabase, verifyNasrIndexes } from "./validation.mjs";

export { validateNasrDatabase, verifyNasrIndexes } from "./validation.mjs";

export function importNasrDatabase(
  inputPath,
  outputPath = DEFAULT_OUTPUT,
  { Database = DatabaseSync, exists, copy, mkdir, rename, remove } = {},
) {
  const files = createNasrImportFiles({ exists, copy, mkdir, rename, remove });
  const input = resolve(inputPath || "");
  const output = resolve(outputPath);
  if (!inputPath || !files.exists(input))
    throw new Error(`Input NASR database not found: ${input}`);
  if (input === output) throw new Error("Input and output NASR database paths must be different.");
  const source = new Database(input, { readOnly: true });
  try {
    validateNasrDatabase(source);
  } finally {
    source.close();
  }
  files.prepareOutput(output);
  const temporary = files.temporaryPath(output);
  try {
    files.copyInput(input, temporary);
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
    files.install(temporary, output);
    return { output, indexes: NASR_INDEXES.length };
  } catch (error) {
    files.cleanup(temporary);
    throw error;
  }
}

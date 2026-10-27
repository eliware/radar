import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { installNasrIndexes } from "./index-installer.mjs";
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
    let indexes;
    try {
      indexes = installNasrIndexes(database);
      validateNasrDatabase(database);
      verifyNasrIndexes(database);
      verifyNasrQueryPlans(database);
    } finally {
      database.close();
    }
    files.install(temporary, output);
    return { output, indexes };
  } catch (error) {
    files.cleanup(temporary);
    throw error;
  }
}

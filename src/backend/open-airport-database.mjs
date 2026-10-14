import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../nasr/NASR_2026_10_01.sqlite",
);

export function openAirportDatabase(path, { Database = DatabaseSync, exists = existsSync } = {}) {
  const file = resolve(path || DEFAULT_PATH);
  if (!exists(file)) {
    if (path) throw new Error(`NASR database file not found: ${file}`);
    return null;
  }
  return new Database(file, { readOnly: true });
}

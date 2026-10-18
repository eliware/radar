#!/usr/bin/env node
import { importNasrDatabase } from "../src/backend/nasr/database.mjs";

const input = process.argv[2];
if (!input || process.argv.length !== 3) {
  console.error("Usage: npm run import:db -- <NASR-database-file>");
  process.exitCode = 2;
} else {
  try {
    const result = importNasrDatabase(input);
    console.log(`Imported NASR database to ${result.output} with ${result.indexes} indexes.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

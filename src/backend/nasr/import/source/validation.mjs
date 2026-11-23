import { default as validateNasrDatabase } from "../../validation.mjs";
import { default as withNasrSourceDatabase } from "./connection.mjs";

function validateNasrSource(Database, inputPath) {
  return withNasrSourceDatabase(Database, inputPath, validateNasrDatabase);
}
export default validateNasrSource;

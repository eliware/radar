import { expect, test } from "@jest/globals";
import { importNasrDatabase } from "../../../src/backend/nasr/database.mjs";

test("public importer delegates to the NASR import lifecycle", () => {
  expect(() => importNasrDatabase()).toThrow("Input NASR database not found");
});

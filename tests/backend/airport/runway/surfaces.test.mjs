import { expect, test } from "@jest/globals";
import { PAVED_SURFACES } from "../../../../src/backend/airport/runway/surfaces.mjs";

test("defines the supported paved runway surface codes", () => {
  expect(PAVED_SURFACES).toBe("'ASPH', 'CONC', 'ASPH-CONC', 'CONC-ASPH', 'ASPH/CONC', 'CONC/ASPH'");
});

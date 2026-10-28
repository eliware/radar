import { expect, test } from "@jest/globals";
import { createNasrTemporaryPath } from "../../../../../src/backend/nasr/import/temporary/path.mjs";

test("adds a process-specific suffix to the requested output path", () => {
  expect(createNasrTemporaryPath("/tmp/nasr.sqlite")).toMatch(/nasr\.sqlite\.tmp-\d+$/);
});

import { expect, test } from "@jest/globals";
import { createAircraftTagCandidates } from "../../../../src/frontend/aircraft/tag/candidates.mjs";

test("generates candidate positions around an aircraft marker", () => {
  expect(createAircraftTagCandidates({ x: 50, y: 60 }, 20, 10)).toEqual([
    { x: 62, y: 38 },
    { x: 62, y: 72 },
    { x: 18, y: 38 },
    { x: 18, y: 72 },
    { x: 40, y: 38 },
    { x: 40, y: 72 },
  ]);
});

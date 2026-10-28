import { expect, test } from "@jest/globals";
import { projectAircraftHistory } from "../../../../src/frontend/project/aircraft-display/history.mjs";

test("projects only history points visible to the camera", () => {
  const history = new Map([
    [
      "A1",
      [
        { x: 1, y: 2, z: 3 },
        { x: 2, y: 3, z: 4 },
        { x: 3, y: 4, z: 5 },
      ],
    ],
  ]);
  const project = (point) => (point.x === 2 ? null : { x: point.x * 2, y: point.z * 2 });
  expect(projectAircraftHistory(history, "A1", project)).toEqual([
    { x: 2, y: 6 },
    { x: 6, y: 10 },
  ]);
});

test("returns empty history when an aircraft has no recorded trail", () => {
  expect(projectAircraftHistory(new Map(), "A1", (point) => point)).toEqual([]);
});

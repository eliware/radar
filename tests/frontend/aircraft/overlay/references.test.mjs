import { expect, jest, test } from "@jest/globals";
import { drawAircraftOverlayReferences } from "../../../../src/frontend/aircraft/overlay/references.mjs";

test("draws reference markers using the prepared scene projection", () => {
  const context = Object.fromEntries(
    [
      "beginPath",
      "moveTo",
      "lineTo",
      "stroke",
      "closePath",
      "fillText",
      "save",
      "restore",
      "arc",
      "setLineDash",
    ].map((name) => [name, jest.fn()]),
  );
  context.measureText = () => ({ width: 8 });
  const project = jest.fn(() => ({ x: 10, y: 20 }));
  drawAircraftOverlayReferences(
    context,
    {
      airports: new Map(),
      navaids: new Map([["ENE", { identifier: "ENE", rangeNm: 1, latitude: 43, longitude: -70 }]]),
      boundaries: new Map(),
      ilsApproaches: new Map(),
      procedures: new Map(),
      airways: new Map(),
    },
    project,
    {
      ilsVisible: true,
      procedureVisibility: { sidVisible: true, starVisible: true },
      airwayVisibility: { Q: true, J: true, V: true },
      runwayVisibility: { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true },
      referenceVisibility: { airportsVisible: true, navaidsVisible: true },
    },
  );
  expect(project).toHaveBeenCalled();
  expect(context.fillText).toHaveBeenCalledWith("ENE", 17, 15);
});

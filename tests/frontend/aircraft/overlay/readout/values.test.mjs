import { expect, test } from "@jest/globals";
import { cameraReadoutRows } from "../../../../../src/frontend/aircraft/overlay/readout/values.mjs";

test("formats coordinate and altitude rows for the current camera position", () => {
  expect(
    cameraReadoutRows(
      { position: { x: 1, y: 2, z: -1 } },
      { latitude: 43, longitude: -70 },
      300,
      400,
    ),
  ).toEqual([
    { value: "  43.0167°", label: "LAT", valueX: 352, labelX: 360, y: 30 },
    { value: " -69.9772°", label: "LON", valueX: 352, labelX: 360, y: 46 },
    { value: "   12,500'", label: "ALT", valueX: 352, labelX: 360, y: 62 },
  ]);
});

test.each([
  [null, { latitude: 43, longitude: -70 }, 300],
  [{ position: { x: 0, y: 0, z: 0 } }, null, 300],
  [{ position: { x: Number.NaN, y: 0, z: 0 } }, { latitude: 43, longitude: -70 }, 300],
  [{ position: { x: 0, y: 0, z: 0 } }, { latitude: 43, longitude: -70 }, Number.NaN],
])("returns no rows for invalid camera readout inputs", (camera, location, elevation) => {
  expect(cameraReadoutRows(camera, location, elevation, 400)).toBeNull();
});

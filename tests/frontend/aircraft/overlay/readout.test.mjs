import { expect, jest, test } from "@jest/globals";
import { drawCameraReadout } from "../../../../src/frontend/aircraft/overlay/readout.mjs";

test("draws formatted rows for valid camera and home coordinates", () => {
  const context = { save: jest.fn(), restore: jest.fn(), fillText: jest.fn() };
  drawCameraReadout(
    context,
    { position: { x: 1, y: 2, z: -1 } },
    { latitude: 43, longitude: -70 },
    300,
    400,
  );
  expect(context.fillText).toHaveBeenCalledTimes(6);
});

test("skips invalid camera or home coordinates", () => {
  const context = { fillText: jest.fn() };
  drawCameraReadout(context, {}, { latitude: 43, longitude: -70 }, 300, 400);
  drawCameraReadout(context, { position: { x: 0, y: 0, z: 0 } }, null, 300, 400);
  drawCameraReadout(
    context,
    { position: { x: Number.NaN, y: 0, z: 0 } },
    { latitude: 43, longitude: -70 },
    300,
    400,
  );
  expect(context.fillText).not.toHaveBeenCalled();
});

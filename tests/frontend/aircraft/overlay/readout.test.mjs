import { expect, jest, test } from "@jest/globals";
import { drawCameraReadout } from "../../../../src/frontend/aircraft/overlay/readout.mjs";

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

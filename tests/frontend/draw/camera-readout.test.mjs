import { expect, jest, test } from "@jest/globals";
import { drawCameraReadout } from "../../../src/frontend/draw/camera-readout.mjs";

test("draws camera position and altitude using the radar monospace font", () => {
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    fillText: jest.fn(),
  };
  drawCameraReadout(
    context,
    { position: { x: 1, y: 2, z: -1 } },
    { latitude: 43, longitude: -70 },
    300,
    400,
  );
  expect(context.font).toBe("12px monospace");
  expect(context.fillStyle).toBe("#00a832");
  expect(context.textAlign).toBe("right");
  expect(context.fillText).toHaveBeenNthCalledWith(1, "LAT   43.0167°", 382, 30);
  expect(context.fillText).toHaveBeenNthCalledWith(2, "LON  -69.9772°", 382, 46);
  expect(context.fillText).toHaveBeenNthCalledWith(3, "ALT    12,500'", 382, 62);
  const [latitude, longitude, altitude] = context.fillText.mock.calls.map(([text]) => text);
  expect(altitude.indexOf("'")).toBe(latitude.indexOf("°"));
  expect(altitude.indexOf("'")).toBe(longitude.indexOf("°"));
  expect(context.save).toHaveBeenCalled();
  expect(context.restore).toHaveBeenCalled();
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

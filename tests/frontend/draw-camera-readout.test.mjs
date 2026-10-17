import { expect, jest, test } from "@jest/globals";
import { drawCameraReadout } from "../../src/frontend/draw-camera-readout.mjs";

test("draws camera position and MSL altitude using the radar monospace font", () => {
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
  );
  expect(context.font).toBe("12px monospace");
  expect(context.fillStyle).toBe("#00a832");
  expect(context.textAlign).toBe("left");
  expect(context.fillText).toHaveBeenNthCalledWith(1, "LAT   43.0167°", 18, 30);
  expect(context.fillText).toHaveBeenNthCalledWith(2, "LON  -69.9772°", 18, 46);
  expect(context.fillText).toHaveBeenNthCalledWith(3, "ALT 12,500' MSL", 18, 62);
  expect(context.save).toHaveBeenCalled();
  expect(context.restore).toHaveBeenCalled();
});

test("skips invalid camera or home coordinates", () => {
  const context = { fillText: jest.fn() };
  drawCameraReadout(context, {}, { latitude: 43, longitude: -70 }, 300);
  drawCameraReadout(context, { position: { x: 0, y: 0, z: 0 } }, null, 300);
  drawCameraReadout(
    context,
    { position: { x: Number.NaN, y: 0, z: 0 } },
    { latitude: 43, longitude: -70 },
    300,
  );
  expect(context.fillText).not.toHaveBeenCalled();
});

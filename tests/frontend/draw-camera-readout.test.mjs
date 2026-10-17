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
    { position: { x: 1, y: 1, z: -1 } },
    { latitude: 43, longitude: -70 },
    300,
  );
  expect(context.font).toBe("12px monospace");
  expect(context.fillStyle).toBe("#00a832");
  expect(context.fillText).toHaveBeenCalledWith("CAM 43.0167°, -69.9772° · 6376 ft MSL", 18, 50);
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

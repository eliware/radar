import { expect, jest, test } from "@jest/globals";
import { drawCameraReadout } from "../../../../../src/frontend/aircraft/overlay/readout.mjs";

test("draws formatted camera rows using the radar monospace font", () => {
  const context = { save: jest.fn(), restore: jest.fn(), fillText: jest.fn() };
  drawCameraReadout(
    context,
    { position: { x: 1, y: 2, z: -1 } },
    { latitude: 43, longitude: -70 },
    300,
    400,
  );
  expect(context.font).toBe('12px Consolas, "Courier New", monospace');
  expect(context.fillStyle).toBe("#00a832");
  expect(context.fillText).toHaveBeenNthCalledWith(1, "  43.0167°", 352, 30);
  expect(context.fillText).toHaveBeenNthCalledWith(2, "LAT", 360, 30);
  expect(context.fillText).toHaveBeenNthCalledWith(3, " -69.9772°", 352, 46);
  expect(context.fillText).toHaveBeenNthCalledWith(4, "LON", 360, 46);
  expect(context.fillText).toHaveBeenNthCalledWith(5, "   12,500'", 352, 62);
  expect(context.fillText).toHaveBeenNthCalledWith(6, "ALT", 360, 62);
  expect(context.save).toHaveBeenCalled();
  expect(context.restore).toHaveBeenCalled();
});

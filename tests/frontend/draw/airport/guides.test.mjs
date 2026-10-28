import { expect, jest, test } from "@jest/globals";
import { drawRunwayGuides } from "../../../../src/frontend/draw/airport/guides.mjs";

function setup() {
  return {
    context: {
      beginPath: jest.fn(),
      lineTo: jest.fn(),
      moveTo: jest.fn(),
      setLineDash: jest.fn(),
      stroke: jest.fn(),
    },
    end: { latitude: 43, longitude: -70, elevationFeet: 50, alignmentDegrees: 10 },
    project: (point) => ({ x: point.longitude, y: point.latitude }),
  };
}

test("draws extensions and base legs according to their independent visibility", () => {
  const state = setup();
  drawRunwayGuides(state.context, state.end, state.project, true, true);
  expect(state.context.stroke).toHaveBeenCalledTimes(2);
  const noExtensions = setup();
  drawRunwayGuides(noExtensions.context, noExtensions.end, noExtensions.project, false, true);
  expect(noExtensions.context.stroke).toHaveBeenCalledTimes(1);
  const noBaseLegs = setup();
  drawRunwayGuides(noBaseLegs.context, noBaseLegs.end, noBaseLegs.project, true, false);
  expect(noBaseLegs.context.stroke).toHaveBeenCalledTimes(1);
  const neither = setup();
  drawRunwayGuides(neither.context, neither.end, neither.project, false, false);
  expect(neither.context.stroke).not.toHaveBeenCalled();
});

test("draws valid base legs when an extension endpoint is invalid", () => {
  const state = setup();
  let calls = 0;
  drawRunwayGuides(
    state.context,
    state.end,
    () => (++calls <= 2 || calls > 4 ? { x: 1, y: 2 } : null),
    true,
    true,
  );
  expect(state.context.stroke).toHaveBeenCalledTimes(1);
});

test("skips invalid guides and keeps extensions when a base-leg endpoint is invalid", () => {
  const invalid = setup();
  drawRunwayGuides(invalid.context, invalid.end, () => null, true, true);
  expect(invalid.context.stroke).not.toHaveBeenCalled();
  const partial = setup();
  let calls = 0;
  drawRunwayGuides(
    partial.context,
    partial.end,
    () => (++calls === 4 ? null : { x: 1, y: 2 }),
    true,
    true,
  );
  expect(partial.context.stroke).toHaveBeenCalledTimes(1);
});

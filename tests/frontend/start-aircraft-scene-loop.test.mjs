import { startAircraftSceneLoop } from "../../src/frontend/start-aircraft-scene-loop.mjs";
import { expect, jest, test } from "@jest/globals";

test("starts the scene loop with shared references and ILS visibility", () => {
  const isIlsVisible = jest.fn(() => true);
  const options = {
    targets: {},
    trails: {},
    windowRef: {},
    radarCamera: {},
    renderer: {},
    scene: {},
    camera: {},
    container: {},
    overlay: {},
    location: {},
    elevationFeet: 300,
    isConnected: () => true,
    isAutoZoom: () => false,
    ils: { isVisible: isIlsVisible },
    references: { airports: {}, navaids: {}, boundaries: {}, ilsApproaches: {} },
  };
  let loopOptions;
  const createLoop = (value) => {
    loopOptions = value;
    return "stopped";
  };
  expect(startAircraftSceneLoop(options, createLoop)).toBe("stopped");
  expect(loopOptions).toEqual(
    expect.objectContaining({
      isIlsVisible,
      airports: options.references.airports,
      navaids: options.references.navaids,
      boundaries: options.references.boundaries,
      ilsApproaches: options.references.ilsApproaches,
    }),
  );
});

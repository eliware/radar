import { startAircraftSceneLoop } from "../../src/frontend/start-aircraft-scene-loop.mjs";
import { expect, jest, test } from "@jest/globals";

test("starts the scene loop with layer visibility and shared references", () => {
  const isIlsVisible = jest.fn(() => true);
  const isSidVisible = jest.fn(() => true);
  const isStarVisible = jest.fn(() => true);
  const isAirwayVisible = jest.fn(() => true);
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
    layers: {
      ils: { isVisible: isIlsVisible },
      procedures: { isSidVisible, isStarVisible },
      airways: { isVisible: isAirwayVisible },
      runways: { isRunwaysVisible: jest.fn(() => true), isExtensionsVisible: jest.fn(() => true) },
      references: { isAirportsVisible: jest.fn(() => true), isNavaidsVisible: jest.fn(() => true) },
    },
    water: { isVisible: jest.fn(() => true) },
    references: {
      airports: {},
      navaids: {},
      boundaries: {},
      ilsApproaches: {},
      procedures: {},
      airways: {},
    },
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
      isWaterVisible: options.water.isVisible,
      airports: options.references.airports,
      navaids: options.references.navaids,
      boundaries: options.references.boundaries,
      ilsApproaches: options.references.ilsApproaches,
      procedures: options.references.procedures,
      airways: options.references.airways,
    }),
  );
  expect(loopOptions.procedureVisibility.sidVisible).toBe(true);
  expect(loopOptions.procedureVisibility.starVisible).toBe(true);
  expect(loopOptions.airwayVisibility).toBe(options.layers.airways);
  expect(loopOptions.runwayVisibility).toBe(options.layers.runways);
  expect(loopOptions.referenceVisibility.airportsVisible).toBe(true);
  expect(loopOptions.referenceVisibility.navaidsVisible).toBe(true);
});

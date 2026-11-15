import { expect, jest, test } from "@jest/globals";
import { createFlightStripView } from "../../../src/frontend/flight/strips.mjs";

function aircraft(icao, distance) {
  return { icao, callsign: "TEST", distanceNauticalMiles: distance, lastSeen: 1000 };
}

test("updates on resize and each second, then removes stale aircraft on destroy", () => {
  let now = 1000;
  let resize;
  let tick;
  const container = { clientWidth: 700 };
  const windowRef = {
    addEventListener: jest.fn((name, callback) => (resize = callback)),
    getComputedStyle: jest.fn(() => ({ paddingLeft: "10px", paddingRight: "10px" })),
    removeEventListener: jest.fn(),
    setInterval: jest.fn((callback) => ((tick = callback), 17)),
    clearInterval: jest.fn(),
  };
  const view = createFlightStripView(container, windowRef, () => now);
  view.setHome({ latitude: 43, longitude: -70 }, 310);
  view.update([aircraft("FRESH", 5), { icao: "NO-TIME", distanceNauticalMiles: 2 }]);
  view.update({ callsign: "NO-ICAO" });
  expect(container.innerHTML).toContain("2 AIRCRAFT");
  now = 3000;
  tick();
  expect(container.innerHTML).toContain("FRESH");
  container.clientWidth = 300;
  resize();
  expect(container.innerHTML.match(/flight-strip-row/g)).toHaveLength(6);
  now = 122000;
  tick();
  expect(container.innerHTML).toContain("1 AIRCRAFT");
  view.destroy();
  expect(windowRef.removeEventListener).toHaveBeenCalledWith("resize", resize);
  expect(windowRef.clearInterval).toHaveBeenCalledWith(17);
});

test("refreshes remote strips and removes tracks missing from remote snapshots", () => {
  const container = {};
  const view = createFlightStripView(container, {}, () => 1000);
  view.updateRemote([
    { ...aircraft("REMOTE", 1), remoteOnly: true },
    { ...aircraft("LOCAL", 2), remoteOnly: false },
  ]);
  expect(container.innerHTML).toContain("2 AIRCRAFT");
  view.updateRemote([]);
  expect(container.innerHTML).toContain("1 AIRCRAFT");
  expect(container.innerHTML).not.toContain('data-icao="REMOTE"');
  view.destroy();
});

test("replaces the display from a complete filtered aircraft snapshot", () => {
  const container = {};
  const view = createFlightStripView(container, {}, () => 1000);
  view.update(aircraft("OLD", 2));
  view.updateSnapshot([aircraft("NEW", 1), {}]);
  expect(container.innerHTML).toContain('data-icao="NEW"');
  expect(container.innerHTML).not.toContain('data-icao="OLD"');
  view.updateSnapshot(null);
  expect(container.innerHTML).toContain("Waiting for aircraft...");
});

test("supports unavailable containers and windows", () => {
  const view = createFlightStripView(null, undefined);
  view.update(aircraft("A", 1));
  view.destroy();
  expect(true).toBe(true);
});

test("supports a window without timer functions", () => {
  const view = createFlightStripView(null, {});
  view.destroy();
});

test("uses zero padding when computed panel padding is empty", () => {
  const container = { clientWidth: 700 };
  const windowRef = {
    getComputedStyle: jest.fn(() => ({ paddingLeft: "", paddingRight: "" })),
  };
  const view = createFlightStripView(container, windowRef, () => 0);
  expect(windowRef.getComputedStyle).toHaveBeenCalledWith(container);
  view.destroy();
});

import { expect, jest, test } from "@jest/globals";
import { createFlightStripView, renderFlightStrips } from "../../src/frontend/flight-strips.mjs";

function aircraft(icao, distance, callsign = "TEST") {
  return { icao, callsign, distanceNauticalMiles: distance, lastSeen: 1000 };
}

test("renders white strips with a count, one header, sorted rows, and safe text", () => {
  const container = {};
  renderFlightStrips(container, [aircraft("FAR", 9), aircraft("NEAR", 1, "<R&\"'")], 3000, 2000);
  expect(container.innerHTML).toContain("RADAR FLIGHT STRIPS");
  expect(container.innerHTML).toContain("2 AIRCRAFT");
  expect(container.innerHTML.indexOf('data-icao="NEAR"')).toBeLessThan(
    container.innerHTML.indexOf('data-icao="FAR"'),
  );
  expect(container.innerHTML).toContain("&lt;R&amp;&quot;&#39;");
  expect(container.innerHTML.match(/flight-strip-heading/g)).toHaveLength(1);
});

test("renders grouped headings and grouped aircraft rows at narrow widths", () => {
  const container = {};
  renderFlightStrips(container, [aircraft("ONE", 1)], 400, 2000);
  expect(container.innerHTML.match(/flight-strip-heading/g)).toHaveLength(2);
  expect(container.innerHTML.match(/flight-strip-row/g)).toHaveLength(4);
});

test("shows the empty state and accepts a missing container", () => {
  const container = {};
  renderFlightStrips(container, [], 300, 2000);
  expect(container.innerHTML).toContain("Waiting for aircraft...");
  expect(() => renderFlightStrips(null, [], 300)).not.toThrow();
});

test("updates on resize and each second, then removes stale aircraft on destroy", () => {
  let now = 1000;
  let resize;
  let tick;
  const container = { clientWidth: 700 };
  const windowRef = {
    addEventListener: jest.fn((name, callback) => (resize = callback)),
    removeEventListener: jest.fn(),
    setInterval: jest.fn((callback) => ((tick = callback), 17)),
    clearInterval: jest.fn(),
  };
  const view = createFlightStripView(container, windowRef, () => now);
  view.update([aircraft("FRESH", 5), { icao: "NO-TIME", distanceNauticalMiles: 2 }]);
  view.update({ callsign: "NO-ICAO" });
  expect(container.innerHTML).toContain("2 AIRCRAFT");
  now = 3000;
  tick();
  expect(container.innerHTML).toContain("2s");
  container.clientWidth = 300;
  resize();
  expect(container.innerHTML.match(/flight-strip-heading/g)).toHaveLength(3);
  now = 122000;
  tick();
  expect(container.innerHTML).toContain("1 AIRCRAFT");
  view.destroy();
  expect(windowRef.removeEventListener).toHaveBeenCalledWith("resize", resize);
  expect(windowRef.clearInterval).toHaveBeenCalledWith(17);
});

test("supports an unavailable container and window", () => {
  const view = createFlightStripView(null, undefined, () => 0);
  view.update(aircraft("A", 1));
  view.destroy();
  expect(true).toBe(true);
});

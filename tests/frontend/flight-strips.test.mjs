import { expect, jest, test } from "@jest/globals";
import { createFlightStripView } from "../../src/frontend/flight-strips.mjs";
import { renderFlightStrips } from "../../src/frontend/render-flight-strips.mjs";

function aircraft(icao, distance, callsign = "TEST") {
  return { icao, callsign, distanceNauticalMiles: distance, lastSeen: 1000 };
}

test("renders white strips without field headers and sorts safe aircraft data", () => {
  const container = {};
  renderFlightStrips(container, [aircraft("FAR", 9), aircraft("NEAR", 1, "<R&>\"'")], 3000, 1000);
  expect(container.innerHTML).toContain("FLIGHT STRIPS");
  expect(container.innerHTML).toContain("2 AIRCRAFT");
  expect(container.innerHTML.indexOf('data-icao="NEAR"')).toBeLessThan(
    container.innerHTML.indexOf('data-icao="FAR"'),
  );
  expect(container.innerHTML).toContain("&lt;R&amp;&gt;&quot;&#39;");
  expect(container.innerHTML).not.toContain("flight-strip-heading");
  expect(container.innerHTML).not.toMatch(/>CALLSIGN</);
});

test("renders aligned aircraft data rows at narrow widths", () => {
  const container = {};
  renderFlightStrips(container, [aircraft("ONE", 1, "AIRCRAFT1")], 200);
  const tracks = [...container.innerHTML.matchAll(/grid-template-columns:([^"]+)/g)].map(
    (match) => match[1],
  );
  expect(tracks).toHaveLength(3);
  expect(new Set(tracks).size).toBe(1);
});

test("keeps the blank type slot aligned in two-row strips", () => {
  const container = {};
  renderFlightStrips(container, [aircraft("ONE", 1)], 250);
  expect(container.innerHTML.match(/flight-strip-row/g)).toHaveLength(2);
  expect(container.innerHTML).toContain('<span aria-hidden="true"></span>');
});

test("shows the empty state and accepts a missing container", () => {
  const container = {};
  renderFlightStrips(container, [], 300);
  expect(container.innerHTML).toContain("Waiting for aircraft...");
  expect(() => renderFlightStrips(null, [], 300)).not.toThrow();
});

test("limits strip fading to 25 percent until the aircraft expires", () => {
  const container = {};
  renderFlightStrips(container, [aircraft("AGING", 1)], 3000, 91000);
  expect(container.innerHTML).toContain('data-icao="AGING" style="opacity:0.25"');
});

test("marks emergency strips red while retaining the age opacity", () => {
  const container = {};
  renderFlightStrips(container, [{ ...aircraft("EMERGENCY", 1), squawk: "7700" }], 3000, 91000);
  expect(container.innerHTML).toContain(
    'class="flight-strip-aircraft emergency" data-icao="EMERGENCY" style="opacity:0.25"',
  );
});

test("keeps the list scroll position when a refresh replaces its contents", () => {
  const oldList = { scrollTop: 120 };
  const newList = { scrollTop: 0 };
  let html = "old";
  const container = {
    querySelector: jest.fn(() => (html === "old" ? oldList : newList)),
    get innerHTML() {
      return html;
    },
    set innerHTML(value) {
      html = value;
    },
  };
  renderFlightStrips(container, [aircraft("ONE", 1)], 3000, 1000);
  expect(newList.scrollTop).toBe(120);
});

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

test("supports an unavailable container and window", () => {
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

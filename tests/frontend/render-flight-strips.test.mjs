import { expect, test } from "@jest/globals";
import { renderFlightStrips } from "../../src/frontend/render-flight-strips.mjs";

test("renders near-home strip colors in the synchronized green and white phases", () => {
  const container = {};
  const item = { icao: "PASS", callsign: "PASS1", nearHomePass: true, lastSeen: 1000 };
  renderFlightStrips(container, [item], 3000, 1000);
  expect(container.innerHTML).toContain("near-home-pass flash-green");
  renderFlightStrips(container, [item], 3000, 1500);
  expect(container.innerHTML).toContain("near-home-pass flash-white");
});

test.each([
  ["local", false, 'class="flight-strip-aircraft emergency"'],
  ["remote", true, 'class="flight-strip-aircraft remote-only emergency"'],
])("keeps %s emergency red and faded", (_source, remoteOnly, classes) => {
  const container = {};
  renderFlightStrips(
    container,
    [{ icao: "EMERG", squawk: "7700", remoteOnly, nearHomePass: true, lastSeen: 1000 }],
    3000,
    91000,
  );
  expect(container.innerHTML).toContain(classes);
  expect(container.innerHTML).toContain('style="opacity:0.25"');
});

test("marks remote strips amber without applying local pass flashing", () => {
  const container = {};
  renderFlightStrips(
    container,
    [{ icao: "REMOTE", remoteOnly: true, nearHomePass: true, lastSeen: 1000 }],
    3000,
    1000,
  );
  expect(container.innerHTML).toContain('class="flight-strip-aircraft remote-only"');
  expect(container.innerHTML).not.toContain("near-home-pass");
});

test("keeps local strips green and applies the local pass flash", () => {
  const container = {};
  renderFlightStrips(
    container,
    [{ icao: "LOCAL", remoteOnly: false, nearHomePass: true, lastSeen: 1000 }],
    3000,
    1000,
  );
  expect(container.innerHTML).toContain("near-home-pass flash-green");
  expect(container.innerHTML).not.toContain("remote-only");
});

test("does nothing without a container and restores list scrolling after rendering", () => {
  expect(() => renderFlightStrips(null, [], 3000)).not.toThrow();
  const list = { scrollTop: 42 };
  const container = {
    querySelector: () => list,
  };
  renderFlightStrips(container, [], 3000, 1000);
  expect(list.scrollTop).toBe(42);
});

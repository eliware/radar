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

test("keeps emergency strip color precedence and the age-based opacity", () => {
  const container = {};
  renderFlightStrips(
    container,
    [{ icao: "EMERG", squawk: "7700", nearHomePass: true, lastSeen: 1000 }],
    3000,
    91000,
  );
  expect(container.innerHTML).toContain('class="flight-strip-aircraft emergency"');
  expect(container.innerHTML).toContain('style="opacity:0.25"');
});

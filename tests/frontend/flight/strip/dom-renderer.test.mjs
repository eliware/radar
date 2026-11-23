import { expect, jest, test } from "@jest/globals";
import { default as renderFlightStrips } from "../../../../src/frontend/flight/strip/dom-renderer.mjs";
import { default as buildFlightStripData } from "../../../../src/frontend/flight/strip/data.mjs";
import { default as renderFlightStripMarkup } from "../../../../src/frontend/flight/strip/renderer.mjs";

function aircraft(icao, distance, callsign = "TEST") {
  return { icao, callsign, distanceNauticalMiles: distance, lastSeen: 1000 };
}

test("renders safe, sorted aircraft data without field headers", () => {
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

test("renders aligned rows and compact layouts for available widths", () => {
  const narrow = {};
  const oneRow = {};
  const twoRows = {};
  renderFlightStrips(narrow, [aircraft("ONE", 1, "AIRCRAFT1")], 200);
  const tracks = [...narrow.innerHTML.matchAll(/grid-template-columns:([^"]+)/g)].map(
    (match) => match[1],
  );
  expect(tracks).toHaveLength(3);
  expect(new Set(tracks).size).toBe(1);
  expect(narrow.innerHTML).toContain('class="flight-strip-list rows-3"');
  renderFlightStrips(oneRow, [aircraft("ONE", 1)], 3000);
  renderFlightStrips(twoRows, [aircraft("TWO", 1)], 300);
  expect(oneRow.innerHTML).toContain('class="flight-strip-list rows-1"');
  expect(twoRows.innerHTML).toContain('class="flight-strip-list rows-2"');
});

test("keeps blank field slots aligned and renders an empty state", () => {
  const container = {};
  renderFlightStrips(container, [aircraft("ONE", 1)], 250);
  expect(container.innerHTML.match(/flight-strip-row/g)).toHaveLength(2);
  expect(container.innerHTML).toContain('<span aria-hidden="true"></span>');
  renderFlightStrips(container, [], 300);
  expect(container.innerHTML).toContain("Waiting for aircraft...");
  expect(() => renderFlightStrips(null, [], 300)).not.toThrow();
});

test("preserves the list scroll position when replacing its contents", () => {
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

test("renders synchronized pass colors, source colors, emergencies, and fading", () => {
  const container = {};
  const passing = { icao: "PASS", nearHomePass: true, lastSeen: 1000 };
  renderFlightStrips(container, [passing], 3000, 1000);
  expect(container.innerHTML).toContain("near-home-pass flash-green");
  renderFlightStrips(container, [passing], 3000, 1500);
  expect(container.innerHTML).toContain("near-home-pass flash-white");
  renderFlightStrips(
    container,
    [{ icao: "REMOTE", remoteOnly: true, nearHomePass: true, lastSeen: 1000 }],
    3000,
    1000,
  );
  expect(container.innerHTML).toContain('class="flight-strip-aircraft remote-only"');
  expect(container.innerHTML).not.toContain("near-home-pass");
  renderFlightStrips(
    container,
    [{ icao: "EMERG", squawk: "7700", remoteOnly: true, lastSeen: 1000 }],
    3000,
    91000,
  );
  expect(container.innerHTML).toContain('class="flight-strip-aircraft remote-only emergency"');
  expect(container.innerHTML).toContain('style="opacity:0.93"');
});

test("builds markup separately from DOM replacement", () => {
  const markup = renderFlightStripMarkup(
    buildFlightStripData(
      [{ icao: "<ABC>", callsign: "RADAR&1", lastSeen: 1000, remoteOnly: true }],
      3000,
    ),
    1000,
  );
  expect(markup).toContain('data-icao="&lt;ABC&gt;"');
  expect(markup).toContain("RADAR&amp;1");
});

test("renders empty labeled cells and escapes all HTML-sensitive values", () => {
  const markup = renderFlightStripMarkup(
    {
      aircraft: [
        {
          icao: `<>&"'`,
          groups: [[`<>&"'`, ""]],
          labels: [[`<>&"'`, "FIELD"]],
          lastSeen: 1,
        },
      ],
      weights: [[1, 1]],
      count: 1,
      rowCount: 1,
    },
    1,
  );
  expect(markup).toContain('data-icao="&lt;&gt;&amp;&quot;&#39;"');
  expect(markup).toContain('title="&lt;&gt;&amp;&quot;&#39;: &lt;&gt;&amp;&quot;&#39;"');
  expect(markup).toContain('title="FIELD: "');
});
test("renders an empty markup state", () => {
  expect(renderFlightStripMarkup(buildFlightStripData([], 3000))).toContain(
    "Waiting for aircraft...",
  );
});

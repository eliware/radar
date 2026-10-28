import { expect, test } from "@jest/globals";
import { buildFlightStripData } from "../../../../src/frontend/flight/strip/data.mjs";
import { renderFlightStripMarkup } from "../../../../src/frontend/flight/strip/renderer.mjs";

test("renders flight strip data as escaped aircraft markup", () => {
  const data = buildFlightStripData(
    [{ icao: "<ABC>", callsign: "RADAR&1", lastSeen: 1000, remoteOnly: true }],
    3000,
  );
  const markup = renderFlightStripMarkup(data, 1000);
  expect(markup).toContain('class="flight-strip-aircraft');
  expect(markup).toContain('data-icao="&lt;ABC&gt;"');
  expect(markup).toContain("RADAR&amp;1");
  expect(markup).toContain("1 AIRCRAFT");
});

test("escapes all HTML-sensitive characters in aircraft values and labels", () => {
  const markup = renderFlightStripMarkup(
    {
      aircraft: [
        {
          icao: `<>&"'`,
          groups: [[`<>&"'`]],
          labels: [[`<>&"'`]],
          lastSeen: 1,
        },
      ],
      weights: [[1]],
      count: 1,
      rowCount: 1,
    },
    1,
  );
  expect(markup).toContain('data-icao="&lt;&gt;&amp;&quot;&#39;"');
  expect(markup).toContain('title="&lt;&gt;&amp;&quot;&#39;: &lt;&gt;&amp;&quot;&#39;"');
  expect(markup).toContain("&lt;&gt;&amp;&quot;&#39;</span>");
});

test("renders the empty state when there are no aircraft", () => {
  expect(renderFlightStripMarkup(buildFlightStripData([], 3000))).toContain(
    "Waiting for aircraft...",
  );
});

test("renders an empty unlabeled cell without a title", () => {
  const markup = renderFlightStripMarkup(
    {
      aircraft: [
        {
          icao: "ABC",
          groups: [[""]],
          labels: [[""]],
          lastSeen: 1,
        },
      ],
      weights: [[1]],
      count: 1,
      rowCount: 1,
    },
    1,
  );
  expect(markup).toContain('<span aria-hidden="true"></span>');
});

test("renders empty labeled and nonempty unlabeled cells", () => {
  const markup = renderFlightStripMarkup(
    {
      aircraft: [
        {
          icao: "ABC",
          groups: [["", "value"]],
          labels: [["FIELD", ""]],
          lastSeen: 1,
        },
      ],
      weights: [[1, 1]],
      count: 1,
      rowCount: 1,
    },
    1,
  );
  expect(markup).toContain('title="FIELD: "');
  expect(markup).toContain('<span title=": value">value</span>');
});

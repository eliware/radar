import { expect, test } from "@jest/globals";
import { buildCallsignRouteUrl } from "../../../../../src/backend/lookup/callsign/route/url.mjs";

test("builds encoded ADSB.lol route URLs", () => {
  expect(buildCallsignRouteUrl("BAW183")).toBe(
    "https://vrs-standing-data.adsb.lol/routes/BA/BAW183.json",
  );
  expect(buildCallsignRouteUrl("A B")).toBe(
    "https://vrs-standing-data.adsb.lol/routes/A%20/A%20B.json",
  );
});

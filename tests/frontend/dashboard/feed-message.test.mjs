import { expect, test } from "@jest/globals";
import { parseDashboardFeedMessage } from "../../../src/frontend/dashboard/feed-message.mjs";

test("accepts aircraft snapshot messages", () => {
  const snapshot = { event: "aircraft-snapshot", aircraft: [{ icao: "ABC123" }] };
  expect(parseDashboardFeedMessage(JSON.stringify(snapshot))).toEqual(snapshot);
});

test("rejects malformed and non-snapshot feed messages", () => {
  expect(parseDashboardFeedMessage("not-json")).toBeNull();
  expect(parseDashboardFeedMessage(JSON.stringify({ icao: "ABC123" }))).toBeNull();
  expect(parseDashboardFeedMessage(JSON.stringify(null))).toBeNull();
});

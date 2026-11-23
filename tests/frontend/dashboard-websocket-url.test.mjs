import { expect, test } from "@jest/globals";
import { default as dashboardWebSocketUrl } from "../../src/frontend/dashboard-websocket-url.mjs";

test.each([
  ["https:", "wss://localhost:1390/ws"],
  ["http:", "ws://localhost:1390/ws"],
])("maps %s to its WebSocket protocol", (protocol, expected) => {
  expect(dashboardWebSocketUrl({ protocol, host: "localhost:1390" })).toBe(expected);
});

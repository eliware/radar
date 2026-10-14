import { expect, test } from "@jest/globals";
import { dashboardWebSocketUrl } from "../../src/frontend/dashboard-websocket-url.mjs";

test.each([
  ["https:", "wss://localhost:3000/ws"],
  ["http:", "ws://localhost:3000/ws"],
])("maps %s to its WebSocket protocol", (protocol, expected) => {
  expect(dashboardWebSocketUrl({ protocol, host: "localhost:3000" })).toBe(expected);
});

import { expect, jest, test } from "@jest/globals";
import { connectDashboardFeed } from "../../../src/frontend/dashboard/feed.mjs";

test("uses the secure websocket URL for the current dashboard host", () => {
  let socket;
  class MockSocket {
    constructor(url) {
      this.url = url;
      socket = this;
    }
  }
  const feed = connectDashboardFeed({
    WebSocketClass: MockSocket,
    document: { location: { protocol: "https:", host: "radar.test" } },
    scene: {},
    flightStrips: {},
    sendViewport: jest.fn(),
  });
  expect(socket.url).toBe("wss://radar.test/ws");
  feed.close();
});

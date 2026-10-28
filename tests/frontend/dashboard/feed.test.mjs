import { expect, jest, test } from "@jest/globals";
import { connectDashboardFeed } from "../../../src/frontend/dashboard/feed.mjs";

test("connects the dashboard feed and forwards state, messages, and viewport", async () => {
  let socket;
  class MockSocket {
    constructor(url) {
      this.url = url;
      socket = this;
    }
  }
  const scene = { setConnected: jest.fn() };
  const flightStrips = {};
  const sendViewport = jest.fn();
  const feed = connectDashboardFeed({
    WebSocketClass: MockSocket,
    document: { location: { protocol: "https:", host: "radar.test" } },
    scene,
    flightStrips,
    sendViewport,
  });
  socket.onopen();
  expect(scene.setConnected).toHaveBeenCalledWith(true);
  expect(sendViewport).toHaveBeenCalledWith(socket, true);
  socket.onmessage({ data: JSON.stringify({ event: "aircraft-snapshot", aircraft: [] }) });
  socket.onclose();
  expect(scene.setConnected).toHaveBeenLastCalledWith(false);
  feed.close();
});

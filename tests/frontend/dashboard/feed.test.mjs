import { expect, jest, test } from "@jest/globals";
import { connectDashboardFeed } from "../../../src/frontend/dashboard/feed.mjs";

test("reports WebSocket connection state and invokes the open callback", async () => {
  let socket;
  class MockSocket {
    constructor() {
      this.close = jest.fn();
      socket = this;
    }
  }
  const scene = { setConnected: jest.fn() };
  const sendViewport = jest.fn();
  const feed = connectDashboardFeed({
    WebSocketClass: MockSocket,
    document: { location: { protocol: "http:", host: "radar.test" } },
    scene,
    flightStrips: {},
    sendViewport,
  });
  await socket.onopen();
  expect(scene.setConnected).toHaveBeenCalledWith(true);
  expect(sendViewport).toHaveBeenCalledWith(socket, true);
  feed.close();
  expect(socket.close).toHaveBeenCalledTimes(1);
  expect(scene.setConnected).toHaveBeenLastCalledWith(false);
});

test("forwards feed snapshots to the scene and flight strips", () => {
  let socket;
  class MockSocket {
    constructor() {
      socket = this;
      this.close = jest.fn();
    }
  }
  const scene = { setConnected: jest.fn(), updateSnapshot: jest.fn() };
  const flightStrips = { updateSnapshot: jest.fn() };
  const feed = connectDashboardFeed({
    WebSocketClass: MockSocket,
    document: { location: { protocol: "http:", host: "radar.test" } },
    scene,
    flightStrips,
    sendViewport: jest.fn(),
  });
  const aircraft = [{ icao: "ABC123" }];
  socket.onmessage({ data: JSON.stringify({ event: "aircraft-snapshot", aircraft }) });
  expect(scene.updateSnapshot).toHaveBeenCalledWith(aircraft, undefined);
  expect(flightStrips.updateSnapshot).toHaveBeenCalledWith(aircraft);
  feed.close();
});

import { expect, jest, test } from "@jest/globals";
import { connectDashboardFeed } from "../../../src/frontend/dashboard/feed.mjs";

test("updates connection state, aircraft snapshots, strips, and viewport on open", async () => {
  let socket;
  class MockSocket {
    constructor() {
      this.close = jest.fn();
      socket = this;
    }
  }
  const scene = { setConnected: jest.fn(), updateSnapshot: jest.fn() };
  const flightStrips = { updateSnapshot: jest.fn() };
  const sendViewport = jest.fn();
  const feed = connectDashboardFeed({
    WebSocketClass: MockSocket,
    document: { location: { protocol: "http:", host: "radar.test" } },
    scene,
    flightStrips,
    sendViewport,
  });
  await socket.onopen();
  expect(scene.setConnected).toHaveBeenCalledWith(true);
  expect(sendViewport).toHaveBeenCalledWith(socket, true);
  const aircraft = [{ icao: "ABC123" }];
  socket.onmessage({
    data: JSON.stringify({ event: "aircraft-snapshot", aircraft, localFurthestDistanceNm: 23 }),
  });
  expect(scene.updateSnapshot).toHaveBeenCalledWith(aircraft, 23);
  expect(flightStrips.updateSnapshot).toHaveBeenCalledWith(aircraft);
  feed.close();
  expect(socket.close).toHaveBeenCalledTimes(1);
  expect(scene.setConnected).toHaveBeenLastCalledWith(false);
});

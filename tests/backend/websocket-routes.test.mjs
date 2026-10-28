import { expect, jest, test } from "@jest/globals";
import { registerWebSocketRoutes } from "../../src/backend/websocket-routes.mjs";

test("publishes feed snapshots and applies viewport settings", () => {
  let handler;
  const app = { get: jest.fn((path, options, callback) => (handler = callback)) };
  const unsubscribe = jest.fn();
  const feed = {
    subscribe: jest.fn(() => unsubscribe),
    setClientRadius: jest.fn(),
    setClientLocalOnly: jest.fn(),
  };
  registerWebSocketRoutes(app, feed);
  const socket = { readyState: 1, send: jest.fn(), on: jest.fn() };
  handler(socket);
  const update = feed.subscribe.mock.calls[0][0];
  const message = socket.on.mock.calls.find(([event]) => event === "message")[1];
  message(Buffer.from('{"type":"viewport","radiusNm":42,"localOnly":true}'));
  expect(feed.setClientRadius).toHaveBeenCalledWith(socket, 42);
  expect(feed.setClientLocalOnly).toHaveBeenCalledWith(socket, true);
  update({ event: "aircraft-snapshot" });
  expect(socket.send).toHaveBeenCalledWith('{"event":"aircraft-snapshot"}');
  socket.readyState = 3;
  update({ event: "aircraft-snapshot" });
  expect(socket.send).toHaveBeenCalledTimes(1);
  socket.on.mock.calls.find(([event]) => event === "close")[1]();
  socket.on.mock.calls.find(([event]) => event === "error")[1]();
  expect(unsubscribe).toHaveBeenCalledTimes(2);
});

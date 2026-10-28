import { expect, jest, test } from "@jest/globals";
import { createWebSocketReconnection } from "../../../src/frontend/websocket/reconnection.mjs";

test("schedules one reconnect at a time and restores eligibility after retry", () => {
  let retry;
  const onReconnect = jest.fn();
  const onState = jest.fn();
  const reconnection = createWebSocketReconnection({
    setTimer: (callback) => ((retry = callback), 1),
    clearTimer: jest.fn(),
    onReconnect,
    onState,
  });
  const socket = {
    onopen: jest.fn(),
    onmessage: jest.fn(),
    onerror: jest.fn(),
    onclose: jest.fn(),
  };

  reconnection.schedule(socket, socket, false);
  reconnection.schedule(socket, socket, false);
  expect(reconnection.pending).toBe(true);
  expect(onState).toHaveBeenCalledTimes(1);
  expect(socket.onopen).toBeNull();
  retry();
  expect(reconnection.pending).toBe(false);
  expect(onReconnect).toHaveBeenCalledTimes(1);
  expect(reconnection.canHandle(socket, socket, false)).toBe(true);
});

test("ignores stale or stopped failures and cancels pending reconnects", () => {
  const clearTimer = jest.fn();
  const onState = jest.fn();
  const reconnection = createWebSocketReconnection({
    setTimer: () => 5,
    clearTimer,
    onReconnect: jest.fn(),
    onState,
  });
  const socket = {};
  reconnection.schedule(socket, {}, false);
  reconnection.schedule(socket, socket, true);
  expect(onState).not.toHaveBeenCalled();
  reconnection.schedule(socket, socket, false);
  reconnection.cancel();
  expect(clearTimer).toHaveBeenCalledWith(5);
  expect(reconnection.pending).toBe(false);
  expect(reconnection.canHandle(socket, socket, true)).toBe(false);
});

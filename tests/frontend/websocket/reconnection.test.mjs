import { expect, jest, test } from "@jest/globals";
import { createWebSocketReconnection } from "../../../src/frontend/websocket/reconnection.mjs";
import { connectWebSocketFeed } from "../../../src/frontend/websocket/connection.mjs";

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

test("ignores callbacks from sockets replaced by a reconnect", async () => {
  const sockets = [];
  const timers = [];
  const messages = jest.fn();
  const states = [];
  class Socket {
    constructor(url) {
      this.url = url;
      sockets.push(this);
    }
    close() {}
  }
  const feed = connectWebSocketFeed({
    WebSocketClass: Socket,
    url: "ws://host/ws",
    onMessage: messages,
    onState: (state) => states.push(state),
    setTimer: (callback) => (timers.push(callback), timers.length),
    clearTimer: jest.fn(),
  });
  const stale = sockets[0];
  const staleOpen = stale.onopen;
  const staleClose = stale.onclose;
  const staleError = stale.onerror;
  const staleMessage = stale.onmessage;
  stale.onclose();
  timers[0]();
  await staleOpen();
  staleClose();
  staleError();
  staleMessage({ data: "stale" });
  expect(sockets).toHaveLength(2);
  expect(messages).not.toHaveBeenCalled();

  await sockets[1].onopen();
  sockets[1].onmessage({ data: "live" });
  expect(messages).toHaveBeenCalledWith("live");
  expect(states).toEqual([false, true]);
  feed.close();
});

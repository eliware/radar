import { expect, jest, test } from "@jest/globals";
import { createWebSocketRetry } from "../../../src/frontend/websocket/retry.mjs";
import { connectWebSocketFeed } from "../../../src/frontend/websocket/connection.mjs";

test("schedules exponential delays with a thirty-second cap", () => {
  const timers = [];
  const onRetry = jest.fn();
  const retry = createWebSocketRetry({
    setTimer: (callback, delay) => (timers.push({ callback, delay }), timers.length),
    clearTimer: jest.fn(),
    onRetry,
  });
  for (let attempt = 0; attempt < 8; attempt += 1) {
    retry.schedule();
    timers.at(-1).callback();
  }
  expect(timers.map(({ delay }) => delay)).toEqual([
    1000, 2000, 4000, 8000, 16000, 30000, 30000, 30000,
  ]);
  expect(onRetry).toHaveBeenCalledTimes(8);
});

test("ignores duplicate schedules, resets delay, and cancels pending retries", () => {
  const timers = [];
  const clearTimer = jest.fn();
  const onRetry = jest.fn();
  const retry = createWebSocketRetry({
    setTimer: (callback, delay) => (timers.push({ callback, delay }), timers.length),
    clearTimer,
    onRetry,
  });
  retry.schedule();
  retry.schedule();
  expect(retry.pending).toBe(true);
  expect(timers).toHaveLength(1);
  timers[0].callback();
  retry.schedule();
  expect(timers[1].delay).toBe(2000);
  retry.reset();
  timers[1].callback();
  retry.schedule();
  expect(timers[2].delay).toBe(1000);
  retry.cancel();
  expect(clearTimer).toHaveBeenCalledWith(3);
  expect(retry.pending).toBe(false);
  timers[2].callback();
  expect(onRetry).toHaveBeenCalledTimes(2);
});

test("cancels feed reconnection and ignores late retry callbacks after close", () => {
  const clearTimer = jest.fn();
  let retry;
  let socket;
  class Socket {
    constructor() {
      socket = this;
    }
    close() {}
  }
  const feed = connectWebSocketFeed({
    WebSocketClass: Socket,
    url: "ws://host/ws",
    onMessage: jest.fn(),
    onState: jest.fn(),
    setTimer: (callback) => {
      retry = callback;
      return 7;
    },
    clearTimer,
  });
  socket.onclose();
  feed.close();
  expect(clearTimer).toHaveBeenCalledWith(7);
  expect(socket.onclose).toBeNull();
  retry();
  feed.close();
});

test("retries after socket construction fails", () => {
  let attempts = 0;
  let retryCallback;
  class Socket {
    constructor() {
      attempts += 1;
      if (attempts === 1) throw new Error("offline");
    }
  }
  const feed = connectWebSocketFeed({
    WebSocketClass: Socket,
    url: "ws://host/ws",
    onMessage: jest.fn(),
    onState: jest.fn(),
    setTimer: (callback) => {
      retryCallback = callback;
      return 1;
    },
    clearTimer: jest.fn(),
  });
  expect(feed.socket).toBeNull();
  retryCallback();
  expect(feed.socket).toBeInstanceOf(Socket);
  feed.close();

  const stoppedFeed = connectWebSocketFeed({
    WebSocketClass: class {
      constructor() {
        throw new Error("offline");
      }
    },
    url: "ws://host/ws",
    onMessage: jest.fn(),
    onState: jest.fn(),
    setTimer: () => 1,
    clearTimer: jest.fn(),
  });
  stoppedFeed.close();
});

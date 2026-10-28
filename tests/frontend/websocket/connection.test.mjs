import { expect, jest, test } from "@jest/globals";
import { connectWebSocketFeed } from "../../../src/frontend/websocket/connection.mjs";

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
    setTimer: (callback, delay) => (timers.push({ callback, delay }), timers.length),
    clearTimer: jest.fn(),
  });
  const stale = sockets[0];
  const staleOpen = stale.onopen;
  const staleClose = stale.onclose;
  const staleError = stale.onerror;
  const staleMessage = stale.onmessage;
  stale.onclose();
  timers[0].callback();
  await staleOpen();
  staleClose();
  staleError();
  staleMessage({ data: "stale" });
  expect(sockets).toHaveLength(2);
  expect(timers).toHaveLength(1);
  expect(messages).not.toHaveBeenCalled();

  await sockets[1].onopen();
  sockets[1].onmessage({ data: "live" });
  expect(messages).toHaveBeenCalledWith("live");
  expect(states).toEqual([false, true]);
  feed.close();
  expect(states.at(-1)).toBe(false);
});

test("uses default callbacks and delivers messages from the active socket", async () => {
  let socket;
  const messages = [];
  class Socket {
    constructor() {
      socket = this;
    }
    close() {}
  }
  const feed = connectWebSocketFeed({
    WebSocketClass: Socket,
    url: "ws://host/ws",
    onMessage: (message) => messages.push(message),
    onState: jest.fn(),
  });

  await socket.onopen();
  socket.onmessage({ data: "live message" });
  expect(messages).toEqual(["live message"]);
  feed.close();
});

test("uses default timer functions when scheduling a retry", () => {
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
  });

  socket.onclose();
  feed.close();
});

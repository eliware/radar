import { expect, jest, test } from "@jest/globals";
import { connectWebSocketFeed } from "../../../src/frontend/websocket/connection.mjs";

test("retries failed sockets with backoff and resets delay after open", async () => {
  const sockets = [];
  const timers = [];
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
    onMessage: jest.fn(),
    onState: (state) => states.push(state),
    setTimer: (callback, delay) => {
      timers.push({ callback, delay });
      return timers.length;
    },
    clearTimer: jest.fn(),
  });

  const staleOpen = sockets[0].onopen;
  const staleClose = sockets[0].onclose;
  const staleError = sockets[0].onerror;
  const staleMessage = sockets[0].onmessage;
  sockets[0].onerror();
  staleError();
  staleMessage({ data: "stale" });
  expect(sockets[0].onclose).toBeNull();
  await staleOpen();
  expect(timers.map((timer) => timer.delay)).toEqual([1000]);
  timers[0].callback();
  staleClose();
  sockets[1].onclose();
  expect(timers.map((timer) => timer.delay)).toEqual([1000, 2000]);
  timers[1].callback();
  await sockets[2].onopen();
  sockets[2].onclose();
  expect(timers[2].delay).toBe(1000);
  expect(states).toEqual([false, false, true, false]);
  feed.close();
});

test("cancels retry work when the feed closes", () => {
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

test("caps retry delay", () => {
  const delays = [];
  let timerCallback;
  class Socket {
    constructor() {
      this.close = undefined;
    }
  }
  const feed = connectWebSocketFeed({
    WebSocketClass: Socket,
    url: "ws://host/ws",
    onMessage: jest.fn(),
    onState: jest.fn(),
    setTimer: (callback, delay) => {
      timerCallback = callback;
      delays.push(delay);
      return delays.length;
    },
    clearTimer: jest.fn(),
  });
  for (let count = 0; count < 8; count += 1) {
    feed.socket.onclose();
    timerCallback();
  }
  expect(delays).toEqual([1000, 2000, 4000, 8000, 16000, 30000, 30000, 30000]);
  feed.close();
});

test("retries after a socket constructor failure", () => {
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

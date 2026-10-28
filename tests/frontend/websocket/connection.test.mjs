import { expect, jest, test } from "@jest/globals";
import { connectWebSocketFeed } from "../../../src/frontend/websocket/connection.mjs";

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
  feed.close();
});

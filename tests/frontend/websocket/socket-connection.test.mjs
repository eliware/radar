import { expect, jest, test } from "@jest/globals";
import { createSocketConnection } from "../../../src/frontend/websocket/socket-connection.mjs";

test("constructs a socket with its URL", () => {
  const socket = {};
  const WebSocketClass = jest.fn(() => socket);
  expect(createSocketConnection(WebSocketClass, "ws://host/ws")).toBe(socket);
  expect(WebSocketClass).toHaveBeenCalledWith("ws://host/ws");
});

test("returns null when socket construction throws", () => {
  expect(
    createSocketConnection(
      class {
        constructor() {
          throw new Error("offline");
        }
      },
      "ws://host/ws",
    ),
  ).toBeNull();
});

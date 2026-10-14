import { EventEmitter } from "node:events";
import { expect, jest, test } from "@jest/globals";
import { connectSbsFeed } from "../../src/shared/tcp-feed.mjs";

test("forwards lines and reconnects after a reader reset", () => {
  const socket = new EventEmitter();
  socket.destroy = jest.fn();
  const reader = new EventEmitter();
  reader.close = jest.fn();
  const nextSocket = new EventEmitter();
  nextSocket.destroy = jest.fn();
  const nextReader = new EventEmitter();
  nextReader.close = jest.fn();
  const sockets = [socket, nextSocket];
  const readers = [reader, nextReader];
  const connectionFactory = jest.fn(() => sockets.shift());
  const lineReaderFactory = jest.fn(() => readers.shift());
  let retry;
  const timerFactory = jest.fn((callback, delay) => {
    expect(delay).toBe(2000);
    retry = callback;
    return 1;
  });
  const clearTimer = jest.fn();
  const onLine = jest.fn();
  const onError = jest.fn();
  const feed = connectSbsFeed({
    host: "localhost",
    port: 30003,
    onLine,
    onError,
    connectionFactory,
    lineReaderFactory,
    timerFactory,
    clearTimer,
  });

  expect(connectionFactory).toHaveBeenCalledWith({ host: "localhost", port: 30003 });
  expect(lineReaderFactory).toHaveBeenCalledWith({ input: socket });
  expect(feed.isConnected()).toBe(false);
  socket.emit("connect");
  expect(feed.isConnected()).toBe(true);
  reader.emit("line", "MSG,1");
  reader.emit("error", new Error("reset"));
  expect(feed.isConnected()).toBe(false);
  expect(onLine).toHaveBeenCalledWith("MSG,1");
  expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: "reset" }));
  expect(socket.destroy).toHaveBeenCalledTimes(1);
  socket.emit("error", new Error("duplicate"));
  expect(onError).toHaveBeenCalledTimes(1);
  retry();
  nextSocket.emit("connect");
  expect(feed.isConnected()).toBe(true);
  nextReader.emit("line", "MSG,2");
  expect(onLine).toHaveBeenCalledWith("MSG,2");
  feed.close();
  expect(feed.isConnected()).toBe(false);
  expect(reader.close).toHaveBeenCalledTimes(1);
  expect(socket.destroy).toHaveBeenCalledTimes(1);
  expect(nextReader.close).toHaveBeenCalledTimes(1);
  expect(nextSocket.destroy).toHaveBeenCalledTimes(1);
  feed.close();
  expect(nextSocket.destroy).toHaveBeenCalledTimes(1);
});

test("retries after a socket close and cancels retry on close", () => {
  const socket = new EventEmitter();
  socket.destroy = jest.fn();
  const reader = new EventEmitter();
  reader.close = jest.fn();
  let retry;
  const clearTimer = jest.fn();
  const feed = connectSbsFeed({
    host: "localhost",
    port: 30003,
    onLine: jest.fn(),
    onError: jest.fn(),
    connectionFactory: () => socket,
    lineReaderFactory: () => reader,
    timerFactory: (callback) => {
      retry = callback;
      return 2;
    },
    clearTimer,
  });
  socket.emit("close", false);
  expect(clearTimer).not.toHaveBeenCalled();
  feed.close();
  expect(clearTimer).toHaveBeenCalledWith(2);
  retry();
  expect(reader.close).toHaveBeenCalledTimes(1);
});

test("uses the built-in TCP and line reader factories", () => {
  const feed = connectSbsFeed({
    host: "127.0.0.1",
    port: 1,
    onLine: () => undefined,
    onError: () => undefined,
  });
  feed.close();
});

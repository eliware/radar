import { expect, jest, test } from "@jest/globals";
import { dispatchViewportMessage } from "../../../src/backend/websocket/viewport-message.mjs";

test("validates and dispatches viewport options to the feed", () => {
  const socket = {};
  const feed = { setClientRadius: jest.fn(), setClientLocalOnly: jest.fn() };
  dispatchViewportMessage(
    Buffer.from('{"type":"viewport","radiusNm":42,"localOnly":true}'),
    socket,
    feed,
  );
  expect(feed.setClientRadius).toHaveBeenCalledWith(socket, 42);
  expect(feed.setClientLocalOnly).toHaveBeenCalledWith(socket, true);
});

test("ignores malformed, unrelated, and unsupported messages", () => {
  const feed = { setClientRadius: jest.fn(), setClientLocalOnly: jest.fn() };
  expect(() => dispatchViewportMessage(Buffer.from("invalid json"), {}, feed)).not.toThrow();
  dispatchViewportMessage(Buffer.from('{"type":"other"}'), {}, feed);
  dispatchViewportMessage(Buffer.from('{"type":"viewport"}'), {}, {});
  expect(feed.setClientRadius).not.toHaveBeenCalled();
  expect(feed.setClientLocalOnly).not.toHaveBeenCalled();
});

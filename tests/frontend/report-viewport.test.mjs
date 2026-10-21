import { expect, jest, test } from "@jest/globals";
import { createViewportReporter } from "../../src/frontend/report-viewport.mjs";

test("reports a clamped viewport radius only when it changes", () => {
  const scene = { visibleRadiusNm: jest.fn(() => 56.2) };
  const send = createViewportReporter(scene);
  const socket = { readyState: 1, send: jest.fn() };
  send(socket);
  send(socket);
  expect(socket.send).toHaveBeenCalledTimes(1);
  expect(socket.send).toHaveBeenCalledWith('{"type":"viewport","radiusNm":57,"localOnly":false}');
  scene.visibleRadiusNm.mockReturnValue(301);
  send(socket);
  expect(socket.send).toHaveBeenLastCalledWith(
    '{"type":"viewport","radiusNm":300,"localOnly":false}',
  );
});

test("reports local-only changes immediately and detaches the key listener", () => {
  const listeners = new Set();
  const documentRef = {
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
  };
  let localOnly = false;
  const send = createViewportReporter(
    { range: () => 20, isLocalOnly: () => localOnly },
    documentRef,
  );
  const socket = { readyState: 1, send: jest.fn() };
  send(socket, true);
  localOnly = true;
  listeners.forEach((listener) => listener({ key: "l" }));
  expect(socket.send).toHaveBeenLastCalledWith(
    '{"type":"viewport","radiusNm":20,"localOnly":true}',
  );
  send.destroy();
  expect(listeners.size).toBe(0);
});

test("ignores unrelated, modified, and editable local-only shortcuts", () => {
  const listeners = new Set();
  const documentRef = { addEventListener: (_type, listener) => listeners.add(listener) };
  const socket = { readyState: 1, send: jest.fn() };
  const send = createViewportReporter({ range: () => 20 }, documentRef);
  send(socket, true);
  [
    { key: "x" },
    { key: "l", altKey: true },
    { key: "l", ctrlKey: true },
    { key: "l", metaKey: true },
    { key: "l", target: { tagName: "input" } },
    { key: "l", target: { tagName: "textarea" } },
    { key: "l", target: { tagName: "select" } },
    { key: "l", target: { isContentEditable: true } },
  ].forEach((event) => listeners.forEach((listener) => listener(event)));
  expect(socket.send).toHaveBeenCalledTimes(1);
});

test("waits for an open socket and supports forced refreshes", () => {
  const send = createViewportReporter({ range: () => 20 });
  const socket = { readyState: 0, send: jest.fn() };
  send(socket, true);
  socket.readyState = 1;
  send(socket, true);
  expect(socket.send).toHaveBeenCalledTimes(1);
});

import { expect, jest, test } from "@jest/globals";
import { createViewportReporter } from "../../src/frontend/report-viewport.mjs";

test("reports a clamped viewport radius only when it changes", () => {
  const scene = { visibleRadiusNm: jest.fn(() => 56.2) };
  const send = createViewportReporter(scene);
  const socket = { readyState: 1, send: jest.fn() };
  send(socket);
  send(socket);
  expect(socket.send).toHaveBeenCalledTimes(1);
  expect(socket.send).toHaveBeenCalledWith('{"type":"viewport","radiusNm":57}');
  scene.visibleRadiusNm.mockReturnValue(301);
  send(socket);
  expect(socket.send).toHaveBeenLastCalledWith('{"type":"viewport","radiusNm":300}');
});

test("waits for an open socket and supports forced refreshes", () => {
  const send = createViewportReporter({ range: () => 20 });
  const socket = { readyState: 0, send: jest.fn() };
  send(socket, true);
  socket.readyState = 1;
  send(socket, true);
  expect(socket.send).toHaveBeenCalledTimes(1);
});

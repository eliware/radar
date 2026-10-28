import { expect, jest, test } from "@jest/globals";
import { createDashboardViewport } from "../../../src/frontend/dashboard/viewport.mjs";

test("reports view changes through the live feed and detaches its reporter", () => {
  const listeners = new Set();
  const viewListeners = new Set();
  const documentRef = {
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
  };
  let localOnly = false;
  const scene = {
    visibleRadiusNm: () => 54,
    isLocalOnly: () => localOnly,
    onViewChange: (listener) => {
      viewListeners.add(listener);
      return () => viewListeners.delete(listener);
    },
  };
  const viewport = createDashboardViewport(scene, documentRef);
  const socket = { readyState: 1, send: jest.fn() };
  const detachView = viewport.observe(() => socket);

  viewListeners.forEach((listener) => listener());
  expect(socket.send).toHaveBeenCalledWith('{"type":"viewport","radiusNm":54,"localOnly":false}');
  localOnly = true;
  listeners.forEach((listener) => listener({ key: "l" }));
  expect(socket.send).toHaveBeenLastCalledWith(
    '{"type":"viewport","radiusNm":54,"localOnly":true}',
  );
  detachView();
  viewport.destroy();
  expect(viewListeners.size).toBe(0);
  expect(listeners.size).toBe(0);
});

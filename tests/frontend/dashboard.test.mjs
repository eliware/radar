import { expect, jest, test } from "@jest/globals";
import { startDashboard } from "../../src/frontend/dashboard.mjs";
function makeDocument(protocol = "https:") {
  const keyListeners = new Map([["keydown", []]]),
    compassListeners = new Map();
  const compass = {
    setAttribute: jest.fn(),
    addEventListener: jest.fn((name, callback) => compassListeners.set(name, callback)),
    removeEventListener: jest.fn(),
  };
  const rose = { setAttribute: jest.fn() },
    heading = {};
  const strips = { clientWidth: 800, hidden: false };
  const dashboard = { classList: { toggle: jest.fn() } };
  const metarDisplay = {
    dataset: {},
    setAttribute: jest.fn((_name, value) => (metarDisplay.dataset.radarMode = value)),
  };
  const elements = {
    "[data-scene]": {},
    ".dashboard": dashboard,
    "[data-radar-compass]": compass,
    "[data-compass-rose]": rose,
    "[data-compass-heading]": heading,
    "[data-flight-strips]": strips,
    "[data-metar]": metarDisplay,
    "[data-metar-reports]": { textContent: "", innerHTML: "" },
    "[data-metar-ticker]": { textContent: "" },
  };
  return {
    compass,
    strips,
    location: { protocol, host: "localhost:3000" },
    addEventListener: jest.fn((name, callback) => keyListeners.get(name).push(callback)),
    removeEventListener: jest.fn(),
    sendKey: (event) => keyListeners.get("keydown").forEach((callback) => callback(event)),
    clickCompass: () => compassListeners.get("click")(),
    querySelector: (selector) => elements[selector],
    querySelectorAll: () => [],
  };
}
function jsonResponse(value, ok = true) {
  return { ok, json: async () => value };
}
test("starts the secure live view and handles feed messages", async () => {
  const document = makeDocument();
  const responses = [
    jsonResponse({ location: { latitude: 43, longitude: -70 }, elevationFeet: 300 }),
    jsonResponse({ reports: [{ id: "KPWM", metar: "METAR" }] }),
  ];
  const fetchData = jest.fn((path, options) =>
    path === "/api/route-lookups"
      ? Promise.resolve({
          ok: true,
          json: async () => ({ enabled: options.body.includes("true") }),
        })
      : Promise.resolve(responses.shift()),
  );
  const scene = {
    update: jest.fn(),
    setConnected: jest.fn(),
    onViewChange: jest.fn(() => detachCompass),
    visibleRadiusNm: jest.fn(() => 55.2),
    destroy: jest.fn(),
  };
  const detachCompass = jest.fn();
  const detachViewport = jest.fn();
  scene.onViewChange.mockReturnValueOnce(detachCompass).mockReturnValueOnce(detachViewport);
  const createScene = jest.fn(({ onMode }) => {
    onMode("2D");
    return scene;
  });
  let socket;
  class MockSocket {
    constructor(url) {
      this.url = url;
      this.readyState = 1;
      this.send = jest.fn();
      socket = this;
    }
  }
  const result = await startDashboard({
    document,
    fetchData,
    WebSocketClass: MockSocket,
    createScene,
  });
  expect(result).toEqual(expect.objectContaining({ scene, socket }));
  expect(fetchData).not.toHaveBeenCalledWith("/api/aircraft");
  document.sendKey({ key: "f", preventDefault: jest.fn() });
  document.sendKey({ key: "m", preventDefault: jest.fn() });
  expect(document.strips.hidden).toBe(true);
  expect(fetchData).toHaveBeenCalledWith(
    "/api/route-lookups",
    expect.objectContaining({ method: "POST", body: JSON.stringify({ enabled: false }) }),
  );
  await socket.onopen();
  scene.onViewChange.mock.calls.at(-1)[0]();
  expect(socket.send).toHaveBeenCalledWith('{"type":"viewport","radiusNm":56}');
  socket.onmessage({ data: JSON.stringify({ event: "aircraft-snapshot", aircraft: [] }) });
  socket.onclose();
  expect(scene.setConnected).toHaveBeenLastCalledWith(false);
  result.destroy();
  expect(detachViewport).toHaveBeenCalledTimes(1);
  expect(scene.destroy).toHaveBeenCalledTimes(1);
});
test("does not start when the page or configuration is missing", async () => {
  const document = makeDocument();
  document.querySelector = () => null;
  expect(await startDashboard({ document, fetchData: jest.fn() })).toBeNull();
  const failed = await startDashboard({
    document: makeDocument(),
    fetchData: jest.fn().mockResolvedValue(jsonResponse({}, false)),
  });
  expect(failed).toBeNull();
});
test("destroys the scene when dashboard setup fails after scene creation", async () => {
  const fetchData = jest
    .fn()
    .mockResolvedValueOnce(jsonResponse({ location: null, elevationFeet: 300 }))
    .mockResolvedValueOnce(jsonResponse({ reports: [] }));
  const scene = {
    onViewChange: jest.fn(() => {
      throw new Error("setup failed");
    }),
    destroy: jest.fn(),
  };
  await startDashboard({ document: makeDocument(), fetchData, createScene: () => scene });
  expect(scene.destroy).toHaveBeenCalledTimes(1);
});
test("loads references to the current 3D viewport bounds instead of all ranges", async () => {
  const document = makeDocument();
  const requested = [];
  const fetchData = jest.fn(async (path) => {
    requested.push(path);
    return jsonResponse(path === "/api/config" ? { location: null, elevationFeet: 300 } : []);
  });
  const viewListeners = [];
  const windowRef = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setInterval: jest.fn().mockReturnValueOnce("strips").mockReturnValueOnce("metar"),
    clearInterval: jest.fn(),
  };
  const scene = {
    update: jest.fn(),
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
    updateIls: jest.fn(),
    updateProcedures: jest.fn(),
    updateAirways: jest.fn(),
    range: () => 20,
    getViewportBounds: () => ({
      minX: -25,
      maxX: 25,
      minZ: -20,
      maxZ: 20,
      minRangeNm: 0,
      maxRangeNm: 30,
    }),
    onViewChange: jest.fn((listener) => {
      viewListeners.push(listener);
      return viewListeners.length === 1 ? jest.fn() : undefined;
    }),
  };
  class MockSocket {}
  const result = await startDashboard({
    document,
    fetchData,
    WebSocketClass: MockSocket,
    createScene: () => scene,
    windowRef,
  });
  await Promise.resolve();
  viewListeners[1](undefined);
  viewListeners[1](30);
  await Promise.resolve();
  expect(scene.onViewChange).toHaveBeenCalledTimes(3);
  expect(requested.filter((path) => path.includes("maxRangeNm=50"))).toHaveLength(6);
  expect(requested).toContain("/api/airports?minRangeNm=0&maxRangeNm=50");
  expect(requested.some((path) => path.includes("maxRangeNm=300"))).toBe(false);
  result.destroy();
  expect(windowRef.clearInterval).toHaveBeenCalledWith("metar");
});
test("supports a scene without a viewport change subscription", async () => {
  const fetchData = jest.fn().mockResolvedValue(jsonResponse({}));
  const scene = { update: jest.fn(), destroy: jest.fn() };
  const windowRef = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
  const result = await startDashboard({
    document: makeDocument(),
    fetchData,
    WebSocketClass: class {},
    createScene: () => scene,
    windowRef,
  });
  expect(result.scene).toBe(scene);
  result.destroy();
  expect(scene.destroy).toHaveBeenCalledTimes(1);
});

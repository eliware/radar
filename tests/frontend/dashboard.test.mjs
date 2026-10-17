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
    heading = {},
    strips = { clientWidth: 800, hidden: false },
    dashboard = { classList: { toggle: jest.fn() } };
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
  const aircraft = { icao: "ABC123" };
  const responses = [
    jsonResponse({ location: { latitude: 43, longitude: -70 }, elevationFeet: 300 }),
    jsonResponse({ reports: [{ id: "KPWM", metar: "METAR" }] }),
    jsonResponse([aircraft]),
    jsonResponse([{ icao: "RESTORE1" }]),
  ];
  const fetchData = jest.fn(() => Promise.resolve(responses.shift()));
  const scene = {
    mode: "2D",
    update: jest.fn(),
    reset: jest.fn(),
    zoomBy: jest.fn(),
    rotateBy: jest.fn(),
    setConnected: jest.fn(),
    onViewChange: jest.fn(() => detachCompass),
    destroy: jest.fn(),
  };
  const detachCompass = jest.fn();
  const createScene = jest.fn(({ onMode }) => {
    onMode("2D");
    return scene;
  });
  let socket;
  class MockSocket {
    constructor(url) {
      this.url = url;
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
  expect(socket.url).toBe("wss://localhost:3000/ws");
  expect(document.querySelector("[data-metar]").dataset.radarMode).toBe("2D");
  expect(fetchData).toHaveBeenCalledWith("/api/metar");
  expect(createScene.mock.calls[0][0]).toMatchObject({
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
  });
  expect(scene.update).toHaveBeenCalledWith(aircraft);
  expect(document.strips.innerHTML).toContain("1 AIRCRAFT");
  document.sendKey({ key: "f", preventDefault: jest.fn() });
  expect(document.strips.hidden).toBe(true);
  document.sendKey({ key: "r", preventDefault: jest.fn() });
  document.clickCompass();
  for (const key of ["ArrowUp", "ArrowLeft"]) document.sendKey({ key, preventDefault: jest.fn() });
  expect(scene.reset).toHaveBeenCalledTimes(2);
  expect(scene.zoomBy).toHaveBeenCalledWith(1 / 1.2);
  expect(scene.rotateBy).toHaveBeenCalledWith(-Math.PI / 12);
  await socket.onopen();
  expect(scene.setConnected).toHaveBeenLastCalledWith(true);
  expect(scene.update).toHaveBeenLastCalledWith({ icao: "RESTORE1" });
  socket.onmessage({ data: '{"icao":"DEF456"}' });
  expect(scene.update).toHaveBeenLastCalledWith({ icao: "DEF456" });
  expect(document.strips.innerHTML).toContain("3 AIRCRAFT");
  socket.onclose();
  expect(scene.setConnected).toHaveBeenLastCalledWith(false);
  result.destroy();
  expect(detachCompass).toHaveBeenCalledTimes(1);
  expect(document.removeEventListener).toHaveBeenCalledTimes(3);
  expect(document.compass.removeEventListener).toHaveBeenCalledTimes(2);
  expect(scene.destroy).toHaveBeenCalledTimes(1);
});

test("does not start when the page or configuration is missing", async () => {
  const document = makeDocument();
  document.querySelector = () => null;
  expect(await startDashboard({ document, fetchData: jest.fn() })).toBeNull();
  expect(
    await startDashboard({
      document: makeDocument(),
      fetchData: jest.fn().mockResolvedValue(jsonResponse({}, false)),
    }),
  ).toBeNull();
});

test("destroys the scene when dashboard setup fails after scene creation", async () => {
  const document = makeDocument();
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
  const result = await startDashboard({ document, fetchData, createScene: () => scene });
  expect(result).toBeNull();
  expect(scene.destroy).toHaveBeenCalledTimes(1);
});

test("loads reference data only for each new view range", async () => {
  const document = makeDocument();
  const requested = [];
  const fetchData = jest.fn(async (path) => {
    requested.push(path);
    return jsonResponse(path === "/api/config" ? { location: null, elevationFeet: 300 } : []);
  });
  let changeView;
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
    range: () => 20,
    onViewChange: jest.fn((listener) => {
      changeView = listener;
      return scene.onViewChange.mock.calls.length === 1 ? jest.fn() : undefined;
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
  await new Promise((resolve) => setTimeout(resolve, 0));
  changeView(undefined);
  changeView(30);
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(scene.onViewChange).toHaveBeenCalledTimes(2);
  expect(requested).toContain("/api/airports?minRangeNm=0&maxRangeNm=20");
  expect(requested).toContain("/api/navaids?minRangeNm=20&maxRangeNm=30");
  expect(requested).toContain("/api/airspace-boundaries?minRangeNm=20&maxRangeNm=30");
  expect(requested).toContain("/api/ils?minRangeNm=20&maxRangeNm=30");
  result.destroy();
  expect(windowRef.clearInterval).toHaveBeenCalledWith("metar");
});

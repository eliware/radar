import { expect, jest, test } from "@jest/globals";
import { startDashboard } from "../../src/frontend/dashboard.mjs";

function makeDocument(protocol = "https:", includeReset = true) {
  const home = {};
  const strips = { clientWidth: 800 };
  const reset = { addEventListener: jest.fn((event, callback) => (reset.callback = callback)) };
  return {
    home,
    reset,
    strips,
    location: { protocol, host: "localhost:3000" },
    querySelector(selector) {
      return {
        "[data-scene]": {},
        "[data-home]": home,
        "[data-reset]": includeReset ? reset : null,
        "[data-flight-strips]": strips,
      }[selector];
    },
    querySelectorAll() {
      return [];
    },
  };
}

function jsonResponse(value, ok = true) {
  return { ok, json: async () => value };
}

test("starts the secure live view and handles feed messages", async () => {
  const document = makeDocument();
  const aircraft = { icao: "ABC123" };
  const fetchData = jest
    .fn()
    .mockResolvedValueOnce(
      jsonResponse({ location: { latitude: 43, longitude: -70 }, elevationFeet: 300 }),
    )
    .mockResolvedValueOnce(jsonResponse([aircraft]))
    .mockResolvedValueOnce(jsonResponse([{ icao: "RESTORE1" }]));
  const scene = {
    mode: "2D",
    update: jest.fn(),
    reset: jest.fn(),
    setConnected: jest.fn(),
  };
  const createScene = jest.fn(() => scene);
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
  expect(result).toEqual({
    scene,
    socket,
    feed: expect.any(Object),
    flightStrips: expect.any(Object),
  });
  expect(socket.url).toBe("wss://localhost:3000/ws");
  expect(document.home.textContent).toContain("43.0000°, -70.0000°");
  expect(createScene).toHaveBeenCalledWith(
    expect.objectContaining({
      container: expect.any(Object),
      location: { latitude: 43, longitude: -70 },
      elevationFeet: 300,
    }),
  );
  expect(scene.update).toHaveBeenCalledWith(aircraft);
  expect(document.strips.innerHTML).toContain("1 AIRCRAFT");
  document.reset.callback();
  expect(scene.reset).toHaveBeenCalledTimes(1);
  await socket.onopen();
  expect(scene.setConnected).toHaveBeenLastCalledWith(true);
  expect(scene.update).toHaveBeenLastCalledWith({ icao: "RESTORE1" });
  socket.onmessage({ data: "not-json" });
  socket.onmessage({ data: '{"icao":"DEF456"}' });
  expect(scene.update).toHaveBeenLastCalledWith({ icao: "DEF456" });
  expect(document.strips.innerHTML).toContain("3 AIRCRAFT");
  socket.onclose();
  expect(scene.setConnected).toHaveBeenLastCalledWith(false);
  result.feed.close();
  result.flightStrips.destroy();
});

test("uses an insecure socket when the page uses HTTP", async () => {
  const document = makeDocument("http:", false);
  const fetchData = jest
    .fn()
    .mockResolvedValueOnce(jsonResponse({ location: null, elevationFeet: 300 }))
    .mockResolvedValueOnce(jsonResponse([]));
  let url;
  let socket;
  class MockSocket {
    constructor(value) {
      url = value;
      socket = this;
    }
  }
  const scene = { update: jest.fn(), reset: jest.fn() };
  const createScene = () => scene;
  const result = await startDashboard({
    document,
    fetchData,
    WebSocketClass: MockSocket,
    createScene,
  });
  expect(url).toBe("ws://localhost:3000/ws");
  expect(document.home.textContent).toContain("Set MY_LOCATION in .env");
  await socket.onopen();
  result.feed.close();
});

test("loads each new reference-data band when the view expands", async () => {
  const document = makeDocument();
  const requested = [];
  const fetchData = jest.fn(async (url) => {
    requested.push(url);
    if (url === "/api/config") return jsonResponse({ location: null, elevationFeet: 300 });
    if (url === "/api/aircraft") return jsonResponse([]);
    return jsonResponse([]);
  });
  let changeView;
  class MockSocket {
    constructor() {}
  }
  const scene = {
    update: jest.fn(),
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
    range: jest.fn(() => 20),
    onViewChange: jest.fn((listener) => (changeView = listener)),
  };

  const result = await startDashboard({
    document,
    fetchData,
    WebSocketClass: MockSocket,
    createScene: () => scene,
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  changeView(undefined);
  changeView(30);
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(scene.onViewChange).toHaveBeenCalledTimes(1);
  expect(requested).toContain("/api/airports?minRangeNm=0&maxRangeNm=20");
  expect(requested).toContain("/api/navaids?minRangeNm=20&maxRangeNm=30");
  expect(requested).toContain("/api/airspace-boundaries?minRangeNm=20&maxRangeNm=30");
  result.feed.close();
});

test("does not start when the page has no scene element", async () => {
  const document = makeDocument();
  document.querySelector = () => null;
  const fetchData = jest.fn();
  expect(await startDashboard({ document, fetchData })).toBeNull();
  expect(fetchData).not.toHaveBeenCalled();
});

test("does not start when configuration fails", async () => {
  const document = makeDocument();
  const fetchData = jest.fn().mockResolvedValue(jsonResponse({}, false));
  expect(await startDashboard({ document, fetchData })).toBeNull();
});

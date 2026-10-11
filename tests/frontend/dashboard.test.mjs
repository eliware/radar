import { expect, jest, test } from "@jest/globals";
import { startDashboard } from "../../src/frontend/dashboard.mjs";

function makeDocument(protocol = "https:", includeReset = true) {
  const status = {};
  const home = {};
  const title = {};
  const hint = {};
  const reset = { addEventListener: jest.fn((event, callback) => (reset.callback = callback)) };
  return {
    status,
    home,
    title,
    hint,
    reset,
    location: { protocol, host: "localhost:3000" },
    querySelector(selector) {
      return {
        "[data-status]": status,
        "[data-scene]": {},
        "[data-home]": home,
        "[data-view-title]": title,
        "[data-controls-hint]": hint,
        "[data-reset]": includeReset ? reset : null,
      }[selector];
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
    .mockResolvedValueOnce(jsonResponse([aircraft]));
  const scene = { mode: "2D", update: jest.fn(), reset: jest.fn() };
  const createScene = jest.fn(({ onMode }) => {
    onMode("3D");
    onMode("2D", false);
    onMode("2D", true);
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
  expect(result).toEqual({ scene, socket });
  expect(socket.url).toBe("wss://localhost:3000/ws");
  expect(document.home.textContent).toContain("43.0000°, -70.0000°");
  expect(document.title.textContent).toBe("LOCAL 2D RADAR");
  expect(document.hint.textContent).toContain("Pinch");
  expect(scene.update).toHaveBeenCalledWith(aircraft);
  document.reset.callback();
  expect(scene.reset).toHaveBeenCalledTimes(1);
  socket.onopen();
  expect(document.status.textContent).toBe("Live feed connected.");
  socket.onclose();
  expect(document.status.textContent).toBe("Live feed disconnected.");
  socket.onerror();
  expect(document.status.textContent).toBe("Live feed error.");
  socket.onmessage({ data: "not-json" });
  socket.onmessage({ data: '{"icao":"DEF456"}' });
  expect(scene.update).toHaveBeenLastCalledWith({ icao: "DEF456" });
});

test("uses an insecure socket when the page uses HTTP", async () => {
  const document = makeDocument("http:", false);
  const fetchData = jest
    .fn()
    .mockResolvedValueOnce(jsonResponse({ location: null, elevationFeet: 300 }))
    .mockResolvedValueOnce(jsonResponse([]));
  let url;
  class MockSocket {
    constructor(value) {
      url = value;
    }
  }
  const scene = { update: jest.fn(), reset: jest.fn() };
  const createScene = ({ onMode }) => {
    onMode("3D");
    return scene;
  };
  const querySelector = document.querySelector.bind(document);
  document.querySelector = (selector) =>
    selector === "[data-view-title]" || selector === "[data-controls-hint]"
      ? null
      : querySelector(selector);
  await startDashboard({
    document,
    fetchData,
    WebSocketClass: MockSocket,
    createScene,
  });
  expect(url).toBe("ws://localhost:3000/ws");
  expect(document.home.textContent).toContain("Set MY_LOCATION in .env");
  expect(document.status.textContent).toContain("0 aircraft tracked");
});

test("does not start when the page has no scene element", async () => {
  const document = makeDocument();
  document.querySelector = (selector) => (selector === "[data-status]" ? document.status : null);
  const fetchData = jest.fn();
  expect(await startDashboard({ document, fetchData })).toBeNull();
  expect(fetchData).not.toHaveBeenCalled();
});

test("reports a failed configuration request", async () => {
  const document = makeDocument();
  const fetchData = jest.fn().mockResolvedValue(jsonResponse({}, false));
  expect(await startDashboard({ document, fetchData })).toBeNull();
  expect(document.status.textContent).toContain("Request failed: /api/config");
});

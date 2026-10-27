import { expect, test } from "@jest/globals";
import { createAdsbLolClients } from "../../../../src/backend/aircraft/adsblol-remote/clients.mjs";

test("tracks connected client radii and excludes local-only clients", () => {
  const clients = createAdsbLolClients(20, 300);
  expect(clients.size).toBe(0);
  expect(clients.hasRemoteClients).toBe(false);
  expect(clients.radiusNm).toBe(0);
  clients.connect("phone");
  clients.connect("desktop");
  clients.setRadius("phone", 42.1);
  clients.setRadius("desktop", 500);
  expect(clients.hasRemoteClients).toBe(true);
  expect(clients.radiusNm).toBe(300);
  clients.setLocalOnly("desktop", true);
  expect(clients.radiusNm).toBe(43);
  clients.disconnect("desktop");
  clients.disconnect("phone");
  expect(clients.hasRemoteClients).toBe(false);
});

test("validates updates and resets connected client state", () => {
  const clients = createAdsbLolClients(0, 300);
  clients.connect("browser");
  expect(clients.radiusNm).toBe(1);
  clients.setRadius("browser", Number.NaN);
  expect(clients.setLocalOnly("missing", true)).toBe(false);
  expect(clients.setLocalOnly("browser", "true")).toBe(false);
  expect(clients.setLocalOnly("browser", true)).toBe(true);
  expect(clients.radiusNm).toBe(0);
  clients.clear();
  expect(clients.size).toBe(0);
});

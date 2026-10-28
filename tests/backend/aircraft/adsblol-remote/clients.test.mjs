import { expect, test } from "@jest/globals";
import { createAdsbLolClients } from "../../../../src/backend/aircraft/adsblol-remote/clients.mjs";

test("tracks connected client radii and excludes local-only clients", () => {
  const clients = createAdsbLolClients(20, 300);
  expect(clients.size).toBe(0);
  expect(clients.settings()).toEqual([]);
  clients.connect("phone");
  clients.connect("desktop");
  clients.setRadius("phone", 42.1);
  clients.setRadius("desktop", 500);
  expect(clients.settings()).toEqual([
    { radiusNm: 43, localOnly: false },
    { radiusNm: 300, localOnly: false },
  ]);
  clients.setLocalOnly("desktop", true);
  expect(clients.settings()[1].localOnly).toBe(true);
  clients.disconnect("desktop");
  clients.disconnect("phone");
  expect(clients.settings()).toEqual([]);
});

test("validates updates and resets connected client state", () => {
  const clients = createAdsbLolClients(0, 300);
  clients.connect("browser");
  expect(clients.settings()[0].radiusNm).toBe(1);
  clients.setRadius("browser", Number.NaN);
  expect(clients.setLocalOnly("missing", true)).toBe(false);
  expect(clients.setLocalOnly("browser", "true")).toBe(false);
  expect(clients.setLocalOnly("browser", true)).toBe(true);
  expect(clients.settings()[0].localOnly).toBe(true);
  clients.clear();
  expect(clients.size).toBe(0);
});

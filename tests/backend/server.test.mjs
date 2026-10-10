import { expect, jest, test } from "@jest/globals";
import Fastify from "fastify";
import { createRadarServer } from "../../src/backend/server.mjs";

test("serves health and aircraft data and relays updates over WebSocket", async () => {
  let publish;
  const aircraft = { icao: "ABC123", lastSeen: 99 };
  const feed = {
    list: jest.fn(() => [aircraft]),
    subscribe: jest.fn((listener) => {
      publish = listener;
      return () => undefined;
    }),
  };
  const app = await createRadarServer({
    feed,
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
  });
  const health = await app.inject({ url: "/health" });
  const config = await app.inject({ url: "/api/config" });
  const list = await app.inject({ url: "/api/aircraft" });
  expect(health.json()).toEqual({ status: "ok" });
  expect(config.json()).toEqual({
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
  });
  expect(list.json()).toEqual([aircraft]);
  const socket = await app.injectWS("/ws");
  const received = new Promise((resolve) =>
    socket.once("message", (data) => resolve(data.toString())),
  );
  publish(aircraft);
  expect(JSON.parse(await received)).toEqual(aircraft);
  socket.terminate();
  await app.close();
});

test("uses the default elevation when no location config is set", async () => {
  const app = await createRadarServer({ feed: { list: () => [] }, fastifyFactory: Fastify });
  const response = await app.inject({ url: "/api/config" });
  expect(response.json()).toEqual({ location: null, elevationFeet: 300 });
  await app.close();
});

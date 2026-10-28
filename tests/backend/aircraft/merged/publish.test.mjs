import { expect, jest, test } from "@jest/globals";
import { createMergedAircraftPublisher } from "../../../../src/backend/aircraft/merged/publish.mjs";

test("publishes the current aircraft and furthest local distance", () => {
  const aircraft = [{ icao: "ABC123" }];
  const state = { list: jest.fn(() => aircraft), localFurthestDistanceNm: jest.fn(() => 4) };
  const clients = { publish: jest.fn() };
  createMergedAircraftPublisher({ state, clients })();
  expect(clients.publish).toHaveBeenCalledWith(aircraft, 4);
});

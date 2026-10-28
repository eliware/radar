import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRemoteSourceApi } from "../../../../../src/backend/aircraft/adsblol-remote/source/api.mjs";

test("publishes subscriber updates and creates the source-facing lifecycle API", () => {
  const aircraft = { list: jest.fn(() => []), setRouteLookupsEnabled: jest.fn() };
  const subscribers = {
    publish: jest.fn(),
    subscribe: jest.fn(),
    clear: jest.fn(),
  };
  const clientLifecycle = {
    connect: jest.fn(),
    setRadius: jest.fn(),
    setLocalOnly: jest.fn(),
    disconnect: jest.fn(),
    close: jest.fn(),
  };
  const sourceApi = createAdsbLolRemoteSourceApi({ aircraft, subscribers });
  sourceApi.publish();
  const api = sourceApi.createPublicApi(clientLifecycle);
  expect(subscribers.publish).toHaveBeenCalledTimes(1);
  expect(api.list).toBe(aircraft.list);
  api.connectClient("client");
  api.setClientRadius("client", 25);
  api.setClientLocalOnly("client", true);
  api.disconnectClient("client");
  api.setRouteLookupsEnabled(false);
  expect(clientLifecycle.connect).toHaveBeenCalledWith("client");
  expect(clientLifecycle.setRadius).toHaveBeenCalledWith("client", 25);
  expect(clientLifecycle.setLocalOnly).toHaveBeenCalledWith("client", true);
  expect(clientLifecycle.disconnect).toHaveBeenCalledWith("client");
  expect(aircraft.setRouteLookupsEnabled).toHaveBeenCalledWith(false);
  api.close();
  expect(clientLifecycle.close).toHaveBeenCalledTimes(1);
  expect(subscribers.clear).toHaveBeenCalledTimes(1);
});

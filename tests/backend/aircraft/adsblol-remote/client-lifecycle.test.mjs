import { expect, jest, test } from "@jest/globals";
import { createAdsbLolClientLifecycle } from "../../../../src/backend/aircraft/adsblol-remote/client-lifecycle.mjs";
import { createAdsbLolClients } from "../../../../src/backend/aircraft/adsblol-remote/clients.mjs";
import { getAdsbLolPollingPolicy } from "../../../../src/backend/aircraft/adsblol-remote/policy.mjs";

function setup() {
  const clients = createAdsbLolClients(25, 300);
  const poller = { start: jest.fn(), stop: jest.fn(), close: jest.fn() };
  const aircraft = { clear: jest.fn() };
  const publish = jest.fn();
  const lifecycle = createAdsbLolClientLifecycle({
    clients,
    pollingPolicy: () => getAdsbLolPollingPolicy(clients, 300),
    poller,
    aircraft,
    publish,
  });
  return { clients, poller, aircraft, publish, lifecycle };
}

test("starts polling for connected clients and updates their radius", () => {
  const { clients, poller, lifecycle } = setup();
  lifecycle.connect("phone");
  lifecycle.setRadius("phone", 42.1);
  expect(clients.settings()).toEqual([{ radiusNm: 43, localOnly: false }]);
  expect(poller.start).toHaveBeenCalledTimes(1);
});

test("stops remote polling when every client is local-only", () => {
  const { clients, poller, aircraft, publish, lifecycle } = setup();
  lifecycle.connect("phone");
  lifecycle.connect("desktop");
  lifecycle.setRadius("desktop", 530);
  lifecycle.setLocalOnly("desktop", true);
  expect(getAdsbLolPollingPolicy(clients, 300).radiusNm).toBe(25);
  lifecycle.setLocalOnly("phone", true);
  expect(poller.stop).toHaveBeenCalledTimes(1);
  expect(aircraft.clear).toHaveBeenCalledTimes(1);
  expect(publish).toHaveBeenCalledTimes(1);
  lifecycle.setLocalOnly("missing", true);
  lifecycle.setLocalOnly("phone", "true");
  expect(poller.stop).toHaveBeenCalledTimes(1);
  lifecycle.setLocalOnly("phone", false);
  expect(poller.start).toHaveBeenCalledTimes(4);
});

test("clears aircraft on disconnect only when no remote clients remain", () => {
  const { poller, aircraft, publish, lifecycle } = setup();
  lifecycle.connect("phone");
  lifecycle.connect("desktop");
  lifecycle.disconnect("desktop");
  expect(poller.stop).not.toHaveBeenCalled();
  lifecycle.setLocalOnly("phone", true);
  lifecycle.disconnect("phone");
  expect(poller.stop).toHaveBeenCalledTimes(2);
  expect(aircraft.clear).toHaveBeenCalledTimes(2);
  expect(publish).toHaveBeenCalledTimes(2);
  lifecycle.close();
  expect(poller.close).toHaveBeenCalledTimes(1);
  expect(aircraft.clear).toHaveBeenCalledTimes(3);
});

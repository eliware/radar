import { expect, jest, test } from "@jest/globals";
import { setMergedClientLocalOnly } from "../../../../src/backend/aircraft/merged/client-locality.mjs";

test("applies locality changes remotely and publishes a replacement snapshot", () => {
  const clients = { setLocalOnly: jest.fn(() => true) };
  const remoteSource = { setClientLocalOnly: jest.fn() };
  const publishSnapshots = jest.fn();
  expect(setMergedClientLocalOnly(clients, remoteSource, "browser", true, publishSnapshots)).toBe(
    true,
  );
  expect(clients.setLocalOnly).toHaveBeenCalledWith("browser", true);
  expect(remoteSource.setClientLocalOnly).toHaveBeenCalledWith("browser", true);
  expect(publishSnapshots).toHaveBeenCalledTimes(1);
});

test("does not propagate or publish an unchanged locality value", () => {
  const clients = { setLocalOnly: jest.fn(() => false) };
  const remoteSource = { setClientLocalOnly: jest.fn() };
  const publishSnapshots = jest.fn();
  expect(setMergedClientLocalOnly(clients, remoteSource, "browser", false, publishSnapshots)).toBe(
    false,
  );
  expect(remoteSource.setClientLocalOnly).not.toHaveBeenCalled();
  expect(publishSnapshots).not.toHaveBeenCalled();
});

test("supports a remote source without local-only controls", () => {
  const clients = { setLocalOnly: jest.fn(() => true) };
  const publishSnapshots = jest.fn();
  expect(setMergedClientLocalOnly(clients, {}, "browser", true, publishSnapshots)).toBe(true);
  expect(publishSnapshots).toHaveBeenCalledTimes(1);
});

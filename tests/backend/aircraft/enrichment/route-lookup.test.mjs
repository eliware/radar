import { expect, jest, test } from "@jest/globals";
import { createAircraftRouteLookup } from "../../../../src/backend/aircraft/enrichment/route-lookup.mjs";

function setup(getCallsignRoute = jest.fn(async () => ({ origin: "EGLL" }))) {
  const metadata = { updateRoute: jest.fn(() => true) };
  const publishIfChanged = jest.fn();
  const lookup = createAircraftRouteLookup({ getCallsignRoute }, metadata, publishIfChanged);
  return { lookup, metadata, publishIfChanged, getCallsignRoute };
}

test("applies eligible callsign route results", async () => {
  const state = setup();
  const publish = jest.fn();
  state.lookup.request("ABC123", "BAW183", {}, publish);
  await Promise.resolve();
  expect(state.metadata.updateRoute).toHaveBeenCalledWith("BAW183", { origin: "EGLL" });
  expect(state.publishIfChanged).toHaveBeenCalledWith("ABC123", true, publish);
});

test("skips disabled, unusable, and complete-route lookups", () => {
  const state = setup();
  state.lookup.request("ABC123", "AD", {}, jest.fn());
  state.lookup.request("ABC123", "BAW183", { origin: "EGLL", destination: "KBOS" }, jest.fn());
  state.lookup.setEnabled(false);
  state.lookup.setEnabled(false);
  state.lookup.request("ABC123", "BAW183", {}, jest.fn());
  expect(state.getCallsignRoute).not.toHaveBeenCalled();
});

test("ignores pending results after disabling and recovers after re-enabling", async () => {
  let complete;
  const state = setup(() => new Promise((resolve) => (complete = resolve)));
  state.lookup.request("ABC123", "BAW183", {}, jest.fn());
  state.lookup.setEnabled(false);
  state.lookup.setEnabled(true);
  complete({ origin: "EGLL" });
  await Promise.resolve();
  expect(state.metadata.updateRoute).not.toHaveBeenCalled();

  state.lookup.request("ABC123", "BAW183", {}, jest.fn());
  complete({ origin: "EGLL" });
  await Promise.resolve();
  expect(state.metadata.updateRoute).toHaveBeenCalledTimes(1);
  expect(state.metadata.updateRoute).toHaveBeenCalledWith("BAW183", { origin: "EGLL" });
});

test("absorbs empty and failed lookup results", async () => {
  const state = setup(
    jest.fn().mockResolvedValueOnce(null).mockRejectedValueOnce(new Error("offline")),
  );
  state.lookup.request("ABC123", "BAW183", {}, jest.fn());
  state.lookup.request("ABC123", "BAW184", {}, jest.fn());
  await Promise.resolve();
  await Promise.resolve();
  expect(state.metadata.updateRoute).toHaveBeenCalledTimes(1);
  expect(state.metadata.updateRoute).toHaveBeenCalledWith("BAW183", null);
});

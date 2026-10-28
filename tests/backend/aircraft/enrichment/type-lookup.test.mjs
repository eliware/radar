import { expect, jest, test } from "@jest/globals";
import { createAircraftTypeLookup } from "../../../../src/backend/aircraft/enrichment/type-lookup.mjs";

test("applies aircraft type lookup results through the metadata store", async () => {
  const metadata = { updateType: jest.fn(() => true) };
  const publishIfChanged = jest.fn();
  const lookup = createAircraftTypeLookup(
    { getAircraftType: jest.fn(async () => ({ aircraftTypeCode: "B738" })) },
    metadata,
    publishIfChanged,
  );
  const publish = jest.fn();
  lookup.request("ABC123", {}, publish);
  await Promise.resolve();
  expect(metadata.updateType).toHaveBeenCalledWith("ABC123", { aircraftTypeCode: "B738" });
  expect(publishIfChanged).toHaveBeenCalledWith("ABC123", true, publish);
});

test("skips known types and absorbs failed lookups", async () => {
  const getAircraftType = jest.fn().mockRejectedValue(new Error("offline"));
  const lookup = createAircraftTypeLookup(
    { getAircraftType },
    { updateType: jest.fn() },
    jest.fn(),
  );
  lookup.request("ABC123", { aircraftTypeCode: "B738" }, jest.fn());
  lookup.request("DEF456", {}, jest.fn());
  await Promise.resolve();
  await Promise.resolve();
  expect(getAircraftType).toHaveBeenCalledTimes(1);
  expect(getAircraftType).toHaveBeenCalledWith("DEF456");
});

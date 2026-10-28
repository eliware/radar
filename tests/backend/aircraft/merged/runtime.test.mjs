import { expect, jest, test } from "@jest/globals";
import { createMergedAircraftRuntime } from "../../../../src/backend/aircraft/merged/runtime.mjs";

test("assembles merged state, clients, publishing, and snapshot timing", () => {
  let localItems = [{ icao: "LOCAL1", distanceNauticalMiles: 2 }];
  const remoteItems = [{ icao: "REMOTE1", remoteOnly: true, distanceNauticalMiles: 4 }];
  let timerCallback;
  const setIntervalFn = jest.fn((callback) => ((timerCallback = callback), 17));
  const clearIntervalFn = jest.fn();
  const runtime = createMergedAircraftRuntime(
    { list: () => localItems },
    { list: () => remoteItems },
    { defaultRangeNm: 10, setIntervalFn, clearIntervalFn },
  );
  expect(runtime.state.list().map(({ icao }) => icao)).toEqual(["LOCAL1", "REMOTE1"]);
  const send = jest.fn();
  runtime.clients.add("client", send);
  runtime.snapshots.start();
  timerCallback();
  expect(send).toHaveBeenCalledWith(
    expect.objectContaining({
      event: "aircraft-snapshot",
      aircraft: expect.arrayContaining([
        expect.objectContaining({ icao: "LOCAL1" }),
        expect.objectContaining({ icao: "REMOTE1" }),
      ]),
    }),
  );
  localItems = [{ icao: "LOCAL2", distanceNauticalMiles: 3 }];
  runtime.refresh();
  expect(runtime.state.list().map(({ icao }) => icao)).toEqual(["LOCAL2", "REMOTE1"]);
  runtime.snapshots.stop();
  expect(setIntervalFn).toHaveBeenCalledWith(expect.any(Function), 1000);
  expect(clearIntervalFn).toHaveBeenCalledWith(17);
});

test("uses default range and timer functions when options are omitted", () => {
  const runtime = createMergedAircraftRuntime({ list: () => [] }, { list: () => [] });
  expect(runtime.state.list()).toEqual([]);
});

import { expect, test } from "@jest/globals";
import { selectAircraftRecordSources } from "../../../../../../src/backend/aircraft/merged/aircraft/source/selection.mjs";

test("selects remote-only, fresh-local, and newer-stale-remote sources", () => {
  const remote = { icao: "ABC", lastSeen: 900 };
  const remoteOnly = selectAircraftRecordSources(null, remote, 1000, 100);
  expect(remoteOnly).toEqual({ primary: remote, fallback: null, remoteOnly: true });
  expect(selectAircraftRecordSources({ lastSeen: 950 }, remote, 1000, 100)).toMatchObject({
    primary: { lastSeen: 950 },
    fallback: remote,
    remoteOnly: false,
  });
  expect(
    selectAircraftRecordSources({ lastSeen: 700 }, { lastSeen: 900 }, 1000, 100),
  ).toMatchObject({ primary: { lastSeen: 900 }, fallback: { lastSeen: 700 } });
});

test("keeps stale local data primary when remote data is not newer", () => {
  const local = { lastSeen: 700 };
  const remote = { lastSeen: 600 };
  expect(selectAircraftRecordSources(local, remote, 1000, 100)).toMatchObject({
    primary: local,
    fallback: remote,
    remoteOnly: false,
  });
});

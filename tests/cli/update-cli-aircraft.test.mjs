import { expect, jest, test } from "@jest/globals";
import { createCliAircraftUpdater } from "../../src/cli/update-cli-aircraft.mjs";
import { createAircraftList } from "../../src/shared/aircraft/list.mjs";

test.each(["OK", "AD", "RM"])(
  "keeps the prior valid callsign when the CLI receives %s",
  (placeholder) => {
    const messages = new Map([
      ["valid", { icao: "406948", callsign: "BAW15K" }],
      ["placeholder", { icao: "406948", callsign: placeholder }],
    ]);
    const updater = createCliAircraftUpdater({
      parseSbsMessage: (line) => messages.get(line),
      aircraftList: createAircraftList({ clock: () => 10 }),
      location: null,
      calculateRange: jest.fn(() => null),
    });

    updater("valid");
    expect(updater("placeholder").callsign).toBe("BAW15K");
  },
);

test("ignores SBS rows without an ICAO address", () => {
  const update = jest.fn();
  const updater = createCliAircraftUpdater({
    parseSbsMessage: () => ({ recordType: "STA" }),
    aircraftList: { update },
    location: null,
    calculateRange: jest.fn(),
  });
  expect(updater("status")).toBeNull();
  expect(update).not.toHaveBeenCalled();
});

import { expect, test } from "@jest/globals";
import { parseSbsMessage } from "../src/sbs-message.mjs";

test("maps all 22 SBS fields to named values", () => {
  const line =
    "MSG,3,1,1,abc123,2,2026/10/10,12:00:00,2026/10/10,12:00:01, TEST123 ,12000,250,180,40.1,-73.1,-500,1200,-1,0,-1,0";
  expect(parseSbsMessage(line)).toEqual({
    recordType: "MSG",
    transmissionType: 3,
    sessionId: "1",
    aircraftId: "1",
    icao: "ABC123",
    flightId: "2",
    generatedDate: "2026/10/10",
    generatedTime: "12:00:00",
    loggedDate: "2026/10/10",
    loggedTime: "12:00:01",
    callsign: "TEST123",
    altitudeFeet: 12000,
    groundSpeedKnots: 250,
    trackDegrees: 180,
    latitude: 40.1,
    longitude: -73.1,
    verticalRateFeetPerMinute: -500,
    squawk: "1200",
    alert: -1,
    emergency: 0,
    spi: -1,
    onGround: 0,
  });
});

test("keeps empty columns and invalid numeric values", () => {
  const fields = Array(22).fill("");
  fields[0] = "MSG";
  fields[1] = "1";
  fields[11] = "bad";
  expect(parseSbsMessage(fields.join(","))).toMatchObject({
    recordType: "MSG",
    transmissionType: 1,
    sessionId: null,
    icao: null,
    callsign: null,
    altitudeFeet: "bad",
  });
});

test("maps supported non-aircraft records and rejects unknown records", () => {
  expect(parseSbsMessage("STA,1,2,3")).toMatchObject({ recordType: "STA", aircraftId: "3" });
  expect(parseSbsMessage("OTHER,9,1,1,ABC123")).toBeNull();
  expect(parseSbsMessage("")).toBeNull();
});

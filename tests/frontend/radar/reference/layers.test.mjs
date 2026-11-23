import { expect, test } from "@jest/globals";
import { default as createRadarReferenceLayers } from "../../../../src/frontend/radar/reference/layers.mjs";

test("defines reference layer names, scene updates, and visible-range padding", () => {
  const layers = createRadarReferenceLayers();
  expect(layers.map(([name, update, padding]) => [name, update, padding])).toEqual([
    ["airports", "updateAirports", 35],
    ["navaids", "updateNavaids", 1],
    ["boundaries", "updateBoundaries", 0],
    ["ils", "updateIls", 35],
    ["procedures", "updateProcedures", 35],
    ["airways", "updateAirways", 0],
  ]);
  expect(layers.every(([, , , identity]) => typeof identity === "function")).toBe(true);
});

test("builds unique identities for each reference record type", () => {
  const identity = Object.fromEntries(
    createRadarReferenceLayers().map(([name, , , selectIdentity]) => [name, selectIdentity]),
  );
  expect(identity.airports({ faaId: "PWM" })).toBe("PWM");
  expect(identity.navaids({ state: "ME", identifier: "ENE" })).toBe("ME:ENE");
  expect(identity.boundaries({ id: "ARTCC" })).toBe("ARTCC");
  expect(identity.ils({ faaId: "PWM", runwayEnd: "11" })).toBe("PWM:11");
  expect(identity.procedures({ id: "SID" })).toBe("SID");
  expect(identity.airways({ id: "V12" })).toBe("V12");
});

import { expect, test } from "@jest/globals";
import { displayColor } from "../../../../src/frontend/draw/aircraft/display-color.mjs";

test("prioritizes emergency red and remote amber over the normal color", () => {
  expect(displayColor({ squawk: "7500", remoteOnly: true }, "white", 0)).toBe("#ff0000");
  expect(displayColor({ remoteOnly: true, nearHomePass: true }, "white", 0)).toBe("#ffbf00");
});

test("uses the normal color or alternates near-home targets by half-second", () => {
  expect(displayColor({}, "blue", 0)).toBe("blue");
  expect(displayColor({ nearHomePass: true }, "blue", 0)).toBe("#00ff41");
  expect(displayColor({ nearHomePass: true }, "blue", 500)).toBe("#ffffff");
});

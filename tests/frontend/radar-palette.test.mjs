import { expect, test } from "@jest/globals";
import { getRadarPalette } from "../../src/frontend/radar-palette.mjs";

test("uses green for connected radar and gray for disconnected radar", () => {
  expect(getRadarPalette(true).bright).toBe("#00ff41");
  expect(getRadarPalette(false)).toEqual({
    bright: "#555555",
    major: "#3a3a3a",
    minor: "#202020",
    trail: "#303030",
  });
});

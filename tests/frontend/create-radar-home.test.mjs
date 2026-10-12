import { expect, jest, test } from "@jest/globals";
import { createRadarHome } from "../../src/frontend/create-radar-home.mjs";

test("sets the home marker and ring colors with feed state", () => {
  const material = { color: { setHex: jest.fn() } };
  const scene = { add: jest.fn() };
  const updateRings = { setConnected: jest.fn() };
  const THREE = {
    MeshBasicMaterial: jest.fn(() => material),
    SphereGeometry: jest.fn(),
    Mesh: jest.fn((geometry, meshMaterial) => ({ geometry, material: meshMaterial })),
  };
  const setConnected = createRadarHome(THREE, scene, updateRings);
  setConnected(true);
  expect(material.color.setHex).toHaveBeenCalledWith(0x00ff41);
  expect(updateRings.setConnected).toHaveBeenCalledWith(true);
  setConnected(false);
  expect(material.color.setHex).toHaveBeenLastCalledWith(0x555555);
  expect(scene.add).toHaveBeenCalledTimes(1);
});

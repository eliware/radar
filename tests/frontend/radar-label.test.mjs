import { expect, jest, test } from "@jest/globals";
import { createRadarLabel, removeRadarLabel } from "../../src/frontend/radar-label.mjs";

function makeThree() {
  class Sprite {
    constructor(material) {
      this.material = material;
      this.scale = { set: jest.fn() };
      this.userData = {};
    }
  }
  return {
    CanvasTexture: class {
      constructor(canvas) {
        this.canvas = canvas;
        this.dispose = jest.fn();
      }
    },
    Sprite,
    SpriteMaterial: class {
      constructor(options) {
        this.options = options;
        this.map = options.map;
        this.dispose = jest.fn();
      }
    },
  };
}

test("creates a canvas sprite label and releases its resources", () => {
  const context = { fillText: jest.fn() };
  const documentRef = { createElement: jest.fn(() => ({ getContext: () => context })) };
  const THREE = makeThree();
  const label = createRadarLabel(THREE, "N123AB", documentRef);
  const scene = { remove: jest.fn() };
  expect(context.font).toBe("48px sans-serif");
  expect(label.scale.set).toHaveBeenCalledWith(6.4, 1, 1);
  expect(context.fillText).toHaveBeenCalledWith("N123AB", 4, 56);
  removeRadarLabel(scene, label);
  expect(scene.remove).toHaveBeenCalledWith(label);
  expect(label.material.map.dispose).toHaveBeenCalled();
  expect(label.material.dispose).toHaveBeenCalled();
  removeRadarLabel(scene, null);
});

test("returns no label when browser canvas or Three.js sprite support is absent", () => {
  expect(createRadarLabel({}, "N123AB", null)).toBeNull();
  const documentRef = { createElement: jest.fn() };
  expect(createRadarLabel({}, "N123AB", documentRef)).toBeNull();
  const THREE = { CanvasTexture: class {}, Sprite: null };
  expect(createRadarLabel(THREE, "N123AB", documentRef)).toBeNull();
});

test("right-aligns aircraft text at the fixed edge of its label", () => {
  const context = { fillText: jest.fn() };
  const documentRef = { createElement: () => ({ getContext: () => context }) };
  const label = createRadarLabel(makeThree(), "N123AB", documentRef, "right");
  expect(context.textAlign).toBe("right");
  expect(context.fillText).toHaveBeenCalledWith("N123AB", 508, 56);
  expect(label).not.toBeNull();
});

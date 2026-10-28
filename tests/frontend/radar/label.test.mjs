import { expect, jest, test } from "@jest/globals";
import { createRadarLabel } from "../../../src/frontend/radar/label.mjs";

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
  const context = { fillText: jest.fn(), clearRect: jest.fn() };
  const documentRef = { createElement: jest.fn(() => ({ getContext: () => context })) };
  const THREE = makeThree();
  const label = createRadarLabel(THREE, "N123AB", documentRef);
  expect(context.font).toBe('48px Consolas, "Courier New", monospace');
  expect(label.scale.set).toHaveBeenCalledWith(6.4, 1, 1);
  expect(context.fillText).toHaveBeenCalledWith("N123AB", 4, 40);
  label.userData.setColor("#ffffff");
  expect(context.fillStyle).toBe("#ffffff");
});

test("returns no label when browser canvas or Three.js sprite support is absent", () => {
  expect(createRadarLabel({}, "N123AB", null)).toBeNull();
  const documentRef = { createElement: jest.fn() };
  expect(createRadarLabel({}, "N123AB", documentRef)).toBeNull();
  const THREE = { CanvasTexture: class {}, Sprite: null };
  expect(createRadarLabel(THREE, "N123AB", documentRef)).toBeNull();
});

test("right-aligns aircraft text at the fixed edge of its label", () => {
  const context = { fillText: jest.fn(), clearRect: jest.fn() };
  const documentRef = { createElement: () => ({ getContext: () => context }) };
  const label = createRadarLabel(makeThree(), "N123AB", documentRef, "right");
  expect(context.textAlign).toBe("right");
  expect(context.fillText).toHaveBeenCalledWith("N123AB", 508, 40);
  expect(label).not.toBeNull();
});

test("centers radar text labels", () => {
  const context = { fillText: jest.fn(), clearRect: jest.fn() };
  const documentRef = { createElement: () => ({ getContext: () => context }) };
  const label = createRadarLabel(makeThree(), "20", documentRef, "center");
  expect(context.textAlign).toBe("center");
  expect(context.fillText).toHaveBeenCalledWith("20", 256, 40);
  expect(label).not.toBeNull();
});

test("uses the global document when no document is supplied", () => {
  const previousDocument = globalThis.document;
  const context = { fillText: jest.fn(), clearRect: jest.fn() };
  globalThis.document = { createElement: () => ({ getContext: () => context }) };
  try {
    const label = createRadarLabel(makeThree(), "N123AB");
    expect(label.userData.textWidthRatio).toBeCloseTo(("N123AB".length * 28) / 512);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});

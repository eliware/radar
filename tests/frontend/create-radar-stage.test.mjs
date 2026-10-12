import { expect, jest, test } from "@jest/globals";
import { createRadarStage } from "../../src/frontend/create-radar-stage.mjs";

test("creates the black radar scene, top-down camera, and renderer", () => {
  const scene = { background: null };
  class Scene {
    constructor() {
      return scene;
    }
  }
  class Color {
    constructor(value) {
      this.value = value;
    }
  }
  class Camera {
    constructor(...values) {
      this.values = values;
      this.up = { set: jest.fn() };
    }
  }
  class WebGLRenderer {
    constructor(options) {
      this.options = options;
      this.domElement = {};
    }
    setPixelRatio(value) {
      this.ratio = value;
    }
  }
  const container = { appendChild: jest.fn() };
  const stage = createRadarStage(
    { Scene, Color, PerspectiveCamera: Camera, WebGLRenderer },
    container,
    { devicePixelRatio: 3 },
  );
  expect(stage.scene.background.value).toBe(0);
  expect(stage.camera.up.set).toHaveBeenCalledWith(0, 0, -1);
  expect(stage.renderer.ratio).toBe(2);
  expect(container.appendChild).toHaveBeenCalledWith(stage.renderer.domElement);
});

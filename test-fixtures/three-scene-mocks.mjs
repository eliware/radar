export function registerThreeSceneMocks(jest) {
  class Vector {
    set(...values) {
      this.values = values;
    }
  }
  class Scene {
    constructor() {
      this.children = [];
      this.rotation = {};
      Scene.instance = this;
    }
    add(item) {
      this.children.push(item);
    }
    remove(item) {
      this.children = this.children.filter((child) => child !== item);
    }
  }
  class Camera {
    constructor() {
      this.position = new Vector();
      this.up = new Vector();
      Camera.instance = this;
    }
    updateProjectionMatrix() {}
  }
  class Renderer {
    constructor() {
      this.domElement = { addEventListener() {}, removeEventListener() {} };
      this.render = jest.fn();
      this.setSize = jest.fn();
      this.dispose = jest.fn();
    }
    setPixelRatio() {}
  }
  class Mesh {
    constructor(geometry, material) {
      this.geometry = geometry;
      this.material = material;
      this.position = new Vector();
      this.scale = new Vector();
      this.rotation = {};
    }
  }
  class TorusGeometry {
    constructor(...values) {
      this.values = values;
    }
    dispose() {}
  }
  class Vector3 {
    constructor(x, y, z) {
      Object.assign(this, { x, y, z });
    }
    project() {
      return this;
    }
  }
  class Controls {
    constructor() {
      this.target = new Vector();
      this.update = jest.fn();
      this.dispose = jest.fn();
      this.listeners = new Map();
      this.addEventListener = (name, callback) => this.listeners.set(name, callback);
      this.removeEventListener = jest.fn();
      Controls.instance = this;
    }
  }
  jest.unstable_mockModule("three", () => ({
    Scene,
    Color: class {},
    PerspectiveCamera: Camera,
    WebGLRenderer: Renderer,
    SphereGeometry: class {},
    TorusGeometry,
    CylinderGeometry: class {},
    MeshBasicMaterial: class {
      constructor(options) {
        this.options = options;
      }
    },
    Mesh,
    Vector3,
  }));
  jest.unstable_mockModule("three/addons/controls/OrbitControls.js", () => ({
    OrbitControls: Controls,
  }));
  return { Scene, Camera, Renderer, Mesh, TorusGeometry, Controls };
}

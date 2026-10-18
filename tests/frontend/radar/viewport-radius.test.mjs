import { expect, test } from "@jest/globals";
import {
  createRadarViewportRadius,
  getRadarViewportRadius,
} from "../../../src/frontend/radar/viewport-radius.mjs";

function threeFor(points) {
  let index = 0;
  class Vector {
    constructor(x = 0, y = 0, z = 0) {
      Object.assign(this, { x, y, z });
    }
  }
  return {
    Vector2: Vector,
    Vector3: Vector,
    Plane: class {
      constructor(normal, constant) {
        this.normal = normal;
        this.constant = constant;
      }
    },
    Raycaster: class {
      setFromCamera() {
        this.ray = {
          intersectPlane: (_plane, target) => {
            const point = points[index++];
            return point ? Object.assign(target, point) : null;
          },
        };
      }
    },
  };
}

test("uses the farthest viewport corner intersection with the ground plane", () => {
  const points = [{ x: 3, z: 4 }, { x: -6, z: 8 }, null, { x: 0, z: 2 }];
  expect(getRadarViewportRadius(threeFor(points), {}, 800, 600, -0.05)).toBe(10);
});

test("bounds the radius and handles a missing ground intersection", () => {
  expect(getRadarViewportRadius(threeFor([{ x: 400, z: 0 }]), {}, 800, 600)).toBe(300);
  expect(getRadarViewportRadius(threeFor([null, null, null, null]), {}, 800, 600)).toBe(1);
  expect(getRadarViewportRadius(threeFor([]), {}, 0, 600)).toBe(1);
});

test("creates a live radius reader from the canvas dimensions and home altitude", () => {
  const radius = createRadarViewportRadius(
    threeFor([{ x: 3, z: 4 }]),
    {},
    { clientWidth: 800, clientHeight: 600 },
    300,
  );
  expect(radius()).toBe(5);
});

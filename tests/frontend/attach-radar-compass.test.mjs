import { expect, jest, test } from "@jest/globals";
import { attachRadarCompass } from "../../src/frontend/attach-radar-compass.mjs";

function makeElement(rect) {
  const listeners = new Map();
  return {
    style: {},
    clientWidth: rect.width,
    clientHeight: rect.height,
    getBoundingClientRect: () => rect,
    addEventListener: jest.fn((name, callback) => listeners.set(name, callback)),
    removeEventListener: jest.fn(),
    setPointerCapture: jest.fn(),
    send(name, event) {
      listeners.get(name)?.(event);
    },
  };
}

function pointer(pointerId, clientX, clientY) {
  return { pointerId, clientX, clientY, preventDefault: jest.fn() };
}

test("drags north around the compass and moves the joystick to orbit the view", () => {
  const rect = { left: 0, top: 0, width: 112, height: 112 };
  const compass = makeElement(rect);
  const north = makeElement(rect);
  const joystick = makeElement(rect);
  const listeners = new Set();
  let angle = 0;
  const view = {
    northAngle: () => angle,
    rotateBy: (delta) => {
      angle += delta;
      listeners.forEach((listener) => listener());
    },
    orbitBy: jest.fn(),
    onViewChange: (listener) => {
      listeners.add(listener);
      listener();
      return () => listeners.delete(listener);
    },
  };
  const documentRef = {
    querySelector: (selector) =>
      ({
        "[data-radar-compass]": compass,
        "[data-compass-north]": north,
        "[data-compass-joystick]": joystick,
      })[selector],
  };
  const detach = attachRadarCompass(documentRef, view);
  expect(north.style.left).toBe("56px");
  north.send("pointerdown", pointer(1, 56, 8));
  north.send("pointermove", pointer(1, 104, 56));
  expect(angle).toBeCloseTo(Math.PI / 2);
  expect(Number.parseFloat(north.style.left)).toBeCloseTo(107.52);
  joystick.send("pointerdown", pointer(2, 56, 56));
  joystick.send("pointermove", pointer(2, 66, 61));
  expect(view.orbitBy).toHaveBeenCalledWith(0.4, 0.2);
  expect(joystick.style.transform).toBe("translate(10px, 5px)");
  joystick.send("pointerup", pointer(2, 66, 61));
  expect(joystick.style.transform).toBe("");
  detach();
  expect(listeners.size).toBe(0);
});

test("normalizes north drags and limits joystick travel", () => {
  const rect = { left: 0, top: 0, width: 112, height: 112 };
  const compass = makeElement(rect);
  const north = makeElement(rect);
  const joystick = makeElement(rect);
  const view = { rotateBy: jest.fn(), orbitBy: jest.fn(), northAngle: () => 0 };
  const documentRef = {
    querySelector: (selector) =>
      ({
        "[data-radar-compass]": compass,
        "[data-compass-north]": north,
        "[data-compass-joystick]": joystick,
      })[selector],
  };
  attachRadarCompass(documentRef, view);
  north.send("pointermove", pointer(1, 56, 8));
  north.send("pointerdown", pointer(1, 58, 104));
  north.send("pointermove", pointer(2, 54, 104));
  north.send("pointermove", pointer(1, 54, 104));
  expect(view.rotateBy.mock.calls[0][0]).toBeCloseTo(0.0833, 3);
  north.send("pointerup", pointer(99, 54, 104));
  north.send("pointerup", pointer(1, 54, 104));
  north.send("pointerdown", pointer(3, 54, 104));
  north.send("pointermove", pointer(3, 58, 104));
  expect(view.rotateBy.mock.calls[1][0]).toBeCloseTo(-0.0833, 3);
  joystick.send("pointerdown", pointer(4, 56, 56));
  joystick.send("pointermove", pointer(4, 100, 100));
  joystick.send("pointerup", pointer(99, 100, 100));
  const [x, y] = joystick.style.transform.match(/[\d.]+/g).map(Number);
  expect(Math.hypot(x, y)).toBeCloseTo(12);
  joystick.send("pointercancel", pointer(4, 100, 100));
  expect(joystick.style.transform).toBe("");
});

test("uses safe defaults when compass dimensions and view callbacks are absent", () => {
  const rect = { left: 0, top: 0, width: 0, height: 0 };
  const compass = makeElement(rect);
  const north = makeElement(rect);
  const joystick = makeElement(rect);
  delete north.setPointerCapture;
  delete joystick.setPointerCapture;
  const documentRef = {
    querySelector: (selector) =>
      ({
        "[data-radar-compass]": compass,
        "[data-compass-north]": north,
        "[data-compass-joystick]": joystick,
      })[selector],
  };
  const detach = attachRadarCompass(documentRef, {});
  expect(north.style.left).toBe("0.5px");
  north.send("pointermove", pointer(1, 0, 0));
  north.send("pointerdown", pointer(1, 0, 0));
  north.send("pointermove", pointer(1, 0, -1));
  joystick.send("pointermove", pointer(2, 0, 0));
  joystick.send("pointerdown", pointer(2, 0, 0));
  joystick.send("pointermove", pointer(2, 0, 0));
  joystick.send("pointercancel", pointer(2, 0, 0));
  north.send("pointercancel", pointer(1, 0, -1));
  detach();
  expect(joystick.style.transform).toBe("");
});

test("does nothing when the compass controls are absent", () => {
  expect(() => attachRadarCompass({ querySelector: () => null }, {})()).not.toThrow();
  expect(() => attachRadarCompass({}, {})()).not.toThrow();
  for (const missing of [
    "[data-radar-compass]",
    "[data-compass-north]",
    "[data-compass-joystick]",
  ]) {
    expect(() =>
      attachRadarCompass({ querySelector: (selector) => (selector === missing ? null : {}) }, {})(),
    ).not.toThrow();
  }
});

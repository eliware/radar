import { expect, jest, test } from "@jest/globals";
import { attachRadarLegendClick } from "../../../src/frontend/attach/radar-legend-click.mjs";

test("routes AIRCRAFT, METAR, flight, base, and ILS clicks through document key handlers", () => {
  const listeners = new Map();
  const element = {
    clientWidth: 320,
    clientHeight: 400,
    addEventListener: jest.fn((type, listener) => listeners.set(`element:${type}`, listener)),
    removeEventListener: jest.fn(),
    getBoundingClientRect: () => ({ left: 100, top: 50, width: 320, height: 400 }),
  };
  const documentListeners = new Set();
  const keys = [];
  const documentRef = {
    addEventListener: jest.fn(
      (type, listener) => type === "keydown" && documentListeners.add(listener),
    ),
    removeEventListener: jest.fn((type, listener) => documentListeners.delete(listener)),
    dispatchEvent: jest.fn((event) => {
      keys.push(event.key);
      documentListeners.forEach((listener) => listener(event));
    }),
  };
  class KeyboardEvent {
    constructor(type, options) {
      Object.assign(this, { type }, options);
    }
  }
  const redraw = jest.fn();
  const detach = attachRadarLegendClick(element, documentRef, { KeyboardEvent }, redraw);
  const click = listeners.get("element:click");
  click({ clientX: 120, clientY: 74 });
  click({ clientX: 120, clientY: 330 });
  click({ clientX: 120, clientY: 346 });
  click({ clientX: 120, clientY: 202 });
  click({ clientX: 120, clientY: 218 });

  expect(keys).toEqual(["l", "m", "f", "b", "i"]);
  expect(redraw).toHaveBeenCalledTimes(2);
  detach();
  expect(element.removeEventListener).toHaveBeenCalledWith("click", click);
  expect(documentListeners.size).toBe(0);
});

test("does not dispatch keyboard actions when a non-toggle legend item is clicked", () => {
  const clickListeners = new Map();
  const element = {
    clientWidth: 320,
    clientHeight: 400,
    addEventListener: (type, listener) => clickListeners.set(type, listener),
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 320, height: 400 }),
  };
  let keyHandler;
  const documentRef = {
    addEventListener: (_type, listener) => (keyHandler = listener),
    dispatchEvent: jest.fn((event) => keyHandler(event)),
  };
  attachRadarLegendClick(element, documentRef, { KeyboardEvent: class {} });
  clickListeners.get("click")({ clientX: 200, clientY: 90 });
  expect(documentRef.dispatchEvent).not.toHaveBeenCalled();
  clickListeners.get("click")({ clientX: 20, clientY: 264 });
  keyHandler({ key: "x" });
  expect(documentRef.dispatchEvent).toHaveBeenCalledTimes(1);
});

test("ignores unavailable event targets and zero-sized views", () => {
  const noop = jest.fn();
  expect(attachRadarLegendClick(null, null, null)()).toBeUndefined();
  const inertElement = { addEventListener() {}, removeEventListener() {} };
  expect(attachRadarLegendClick(inertElement, {}, { KeyboardEvent: class {} })).toBeInstanceOf(
    Function,
  );
  expect(
    attachRadarLegendClick(inertElement, { dispatchEvent() {} }, { KeyboardEvent: class {} }),
  ).toBeInstanceOf(Function);
  expect(
    attachRadarLegendClick(inertElement, { dispatchEvent() {}, addEventListener() {} }, {}),
  ).toBeInstanceOf(Function);
  const element = {
    clientWidth: 0,
    clientHeight: 0,
    addEventListener(type, listener) {
      this.onclick = listener;
    },
    removeEventListener: noop,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
  };
  const documentRef = { addEventListener() {}, removeEventListener() {}, dispatchEvent: noop };
  const detach = attachRadarLegendClick(element, documentRef, { KeyboardEvent: class {} });
  expect(() => element.onclick({ clientX: 0, clientY: 0 })).not.toThrow();
  detach();
});

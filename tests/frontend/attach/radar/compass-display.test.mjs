import { expect, jest, test } from "@jest/globals";
import { attachRadarCompassDisplay } from "../../../../src/frontend/attach/radar/compass-display.mjs";

function makeDocument(missing) {
  const compass = { setAttribute: jest.fn() };
  const rose = { setAttribute: jest.fn() };
  const heading = {};
  const elements = {
    "[data-radar-compass]": compass,
    "[data-compass-rose]": rose,
    "[data-compass-heading]": heading,
  };
  return {
    compass,
    rose,
    heading,
    querySelector: (selector) => (selector === missing ? null : elements[selector]),
  };
}

test("rotates the rose and shows the upright heading from view changes", () => {
  const doc = makeDocument();
  let angle = 0;
  let render;
  const unsubscribe = jest.fn();
  const view = {
    northAngle: () => angle,
    onViewChange: (listener) => ((render = listener), unsubscribe),
  };
  const detach = attachRadarCompassDisplay(doc, view);
  expect(doc.rose.setAttribute).toHaveBeenLastCalledWith("transform", "rotate(0 58 58)");
  expect(doc.heading.textContent).toBe("000");
  angle = (315 * Math.PI) / 180;
  render();
  expect(doc.rose.setAttribute).toHaveBeenLastCalledWith("transform", "rotate(315 58 58)");
  expect(doc.heading.textContent).toBe("045");
  expect(doc.compass.setAttribute).toHaveBeenLastCalledWith(
    "aria-label",
    "Restore view. N E S W 045. Radar heading 045 degrees",
  );
  angle = 2 * Math.PI;
  render();
  expect(doc.heading.textContent).toBe("000");
  detach();
  expect(unsubscribe).toHaveBeenCalledTimes(1);
});

test("uses north when the view has no rotation or subscription", () => {
  const doc = makeDocument();
  const detach = attachRadarCompassDisplay(doc, {});
  expect(doc.rose.setAttribute).toHaveBeenCalledWith("transform", "rotate(0 58 58)");
  expect(doc.heading.textContent).toBe("000");
  detach();
});

test("uses north when the view angle is not finite", () => {
  const doc = makeDocument();
  attachRadarCompassDisplay(doc, { northAngle: () => Number.NaN });
  expect(doc.heading.textContent).toBe("000");
});

test.each(["[data-radar-compass]", "[data-compass-rose]", "[data-compass-heading]"])(
  "does nothing when %s is absent",
  (missing) => {
    const doc = makeDocument(missing);
    expect(() => attachRadarCompassDisplay(doc, {})()).not.toThrow();
  },
);

test("does nothing when the document is absent", () => {
  expect(() => attachRadarCompassDisplay(null, {})()).not.toThrow();
});

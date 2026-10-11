import { expect, jest, test } from "@jest/globals";
import { drawAircraftDisplay } from "../../src/frontend/draw-aircraft-display.mjs";

test("draws history marks, prediction diamonds, and connected three-line tags", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "stroke", "closePath", "fill", "fillText"].map((name) => [
      name,
      jest.fn(),
    ]),
  );
  context.measureText = (text) => ({ width: text.length * 8 });
  drawAircraftDisplay(
    context,
    [
      {
        x: 50,
        y: 50,
        futureX: 80,
        futureY: 30,
        lines: ["ABC", "123C", "400"],
        history: [
          { x: 40, y: 45 },
          { x: 50, y: 50 },
        ],
      },
    ],
    12,
    200,
    100,
  );
  expect(context.fillText).toHaveBeenCalledWith(String.fromCharCode(92), 40, 45);
  expect(context.fillText).toHaveBeenCalledWith("123C", expect.any(Number), expect.any(Number));
  expect(context.lineTo).toHaveBeenCalledWith(80, 30);
  expect(context.closePath).toHaveBeenCalled();
  drawAircraftDisplay(context, [{ x: 0, y: 0, lines: ["-", "-", "-"] }], 12, 10, 10);
});

import { expect, jest, test } from "@jest/globals";
import { drawAircraftDisplay } from "../../../src/frontend/draw/aircraft-display.mjs";

test("draws history marks, hollow prediction diamonds, and connected three-line tags", () => {
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
  expect(context.fill).not.toHaveBeenCalled();
  const leaderStart = context.moveTo.mock.calls.at(-1);
  expect(Math.hypot(leaderStart[0] - 50, leaderStart[1] - 50)).toBeCloseTo(9);
  expect(context.fillText.mock.calls.some(([, x]) => x >= 57)).toBe(true);
  drawAircraftDisplay(context, [{ x: 0, y: 0, lines: ["-", "-", "-"] }], 12, 10, 10);
});

test("fades aircraft markers and labels as their receive age increases", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "stroke", "closePath", "fillText"].map((name) => [
      name,
      jest.fn(),
    ]),
  );
  context.measureText = (text) => ({ width: text.length * 8 });
  const alphaValues = [];
  let alpha = 1;
  Object.defineProperty(context, "globalAlpha", {
    get: () => alpha,
    set: (value) => {
      alpha = value;
      alphaValues.push(value);
    },
  });
  const now = 1_000_000;
  jest.useFakeTimers().setSystemTime(now);
  try {
    drawAircraftDisplay(
      context,
      [
        { x: 20, y: 20, receivedAt: now, lines: ["FRESH", "", ""] },
        { x: 80, y: 80, receivedAt: now - 60_000, lines: ["OLD", "", ""] },
      ],
      12,
      100,
      100,
    );
  } finally {
    jest.useRealTimers();
  }

  expect(alphaValues).toContain(1);
  expect(alphaValues).toContain(0.5);
  expect(alpha).toBe(1);
});

test("draws emergency aircraft red while fading the marker and four-line tag", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "stroke", "closePath", "fillText"].map((name) => [
      name,
      jest.fn(),
    ]),
  );
  context.measureText = (text) => ({ width: text.length * 8 });
  const alphaValues = [];
  let alpha = 1;
  Object.defineProperty(context, "globalAlpha", {
    get: () => alpha,
    set: (value) => {
      alpha = value;
      alphaValues.push(value);
    },
  });
  const now = 1_000_000;
  jest.useFakeTimers().setSystemTime(now);
  try {
    drawAircraftDisplay(
      context,
      [
        {
          x: 20,
          y: 20,
          receivedAt: now - 60_000,
          squawk: "7500",
          lines: ["HIJACKER", "123", "200 B738", "HIJACK"],
        },
      ],
      12,
      100,
      100,
    );
  } finally {
    jest.useRealTimers();
  }
  expect(context.fillStyle).toBe("#ff0000");
  expect(context.strokeStyle).toBe("#ff0000");
  expect(context.fillText).toHaveBeenCalledWith("HIJACK", expect.any(Number), expect.any(Number));
  expect(alphaValues).toContain(0.5);
  expect(alpha).toBe(1);
});

test("flashes near-home targets green and white on alternating half-second phases", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "stroke", "closePath", "fillText"].map((name) => [
      name,
      jest.fn(),
    ]),
  );
  context.measureText = (text) => ({ width: text.length * 8 });
  const target = { x: 20, y: 20, nearHomePass: true, lines: ["PASS", "", ""] };
  drawAircraftDisplay(context, [target], 12, 100, 100, true, 1000);
  expect(context.strokeStyle).toBe("#00ff41");
  drawAircraftDisplay(context, [target], 12, 100, 100, true, 1500);
  expect(context.strokeStyle).toBe("#ffffff");
});

test("draws remote-only targets in yellow-green while preserving emergency red", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "stroke", "closePath", "fillText"].map((name) => [
      name,
      jest.fn(),
    ]),
  );
  context.measureText = (text) => ({ width: text.length * 8 });
  const strokeColors = [];
  context.stroke.mockImplementation(function () {
    strokeColors.push(this.strokeStyle);
  });
  drawAircraftDisplay(
    context,
    [
      { x: 20, y: 20, remoteOnly: true, lines: ["REMOTE", "", ""] },
      { x: 80, y: 80, remoteOnly: true, squawk: "7700", lines: ["EMERG", "", ""] },
    ],
    12,
    100,
    100,
  );
  expect(context.strokeStyle).toBe("#ff0000");
  expect(context.fillStyle).toBe("#ff0000");
  expect(strokeColors).toContain("#ffff00");
  expect(strokeColors).toContain("#ff0000");
});

import { expect, jest, test } from "@jest/globals";
import { drawAircraftTracks } from "../../../../src/frontend/draw/aircraft/tracks.mjs";

function contextWithStrokeStyles() {
  const styles = [];
  const context = {
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(function () {
      styles.push({ color: this.strokeStyle, alpha: this.globalAlpha });
    }),
  };
  return { context, styles };
}

test("applies age fading and the normal color to each track", () => {
  const { context, styles } = contextWithStrokeStyles();
  const now = 1_000_000;
  jest.useFakeTimers().setSystemTime(now);
  try {
    drawAircraftTracks(
      context,
      [
        { x: 1, y: 2, receivedAt: now },
        { x: 3, y: 4, receivedAt: now - 60_000 },
      ],
      "#ffffff",
      0.8,
      now,
    );
  } finally {
    jest.useRealTimers();
  }
  expect(styles[0]).toEqual({ color: "#ffffff", alpha: 0.8 });
  expect(styles[1].alpha).toBeLessThan(0.8);
});

test("calculates marker opacity using the drawing frame timestamp", () => {
  const { context, styles } = contextWithStrokeStyles();
  jest.useFakeTimers().setSystemTime(900_000);
  try {
    drawAircraftTracks(context, [{ x: 1, y: 2, receivedAt: 940_000 }], "#ffffff", 1, 1_000_000);
  } finally {
    jest.useRealTimers();
  }
  expect(styles[0].alpha).toBeCloseTo(0.5);
});

test("flashes near-home tracks green and white on alternating half-second phases", () => {
  const { context, styles } = contextWithStrokeStyles();
  const target = { x: 20, y: 20, nearHomePass: true };
  drawAircraftTracks(context, [target], "#ffffff", 1, 1000);
  drawAircraftTracks(context, [target], "#ffffff", 1, 1500);
  expect(styles.map(({ color }) => color)).toContain("#00ff41");
  expect(styles.map(({ color }) => color)).toContain("#ffffff");
});

test("uses amber for remote tracks and red for emergencies", () => {
  const { context, styles } = contextWithStrokeStyles();
  drawAircraftTracks(
    context,
    [
      { x: 20, y: 20, remoteOnly: true },
      { x: 80, y: 80, remoteOnly: true, squawk: "7700" },
    ],
    "#ffffff",
    1,
    1000,
  );
  expect(styles.map(({ color }) => color)).toContain("#ffbf00");
  expect(styles.map(({ color }) => color)).toContain("#ff0000");
});

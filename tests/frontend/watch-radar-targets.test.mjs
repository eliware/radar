import { expect, jest, test } from "@jest/globals";
import { createRadarTargets } from "../../src/frontend/radar/targets.mjs";
import { watchRadarTargets } from "../../src/frontend/watch-radar-targets.mjs";

test("expires stale targets once per second and stops its timer", () => {
  let now = 1000;
  let tick;
  const targets = createRadarTargets({ clock: () => now, staleAfterMs: 100 });
  targets.update({ icao: "OLD" }, 30);
  const onExpire = jest.fn();
  const onTick = jest.fn();
  const clearInterval = jest.fn();
  const stop = watchRadarTargets({
    targets,
    windowRef: {
      setInterval: (callback, delay) => {
        tick = callback;
        expect(delay).toBe(1000);
        return 42;
      },
      clearInterval,
    },
    onExpire,
    onTick,
  });
  tick();
  expect(onExpire).not.toHaveBeenCalled();
  expect(onTick).toHaveBeenCalledTimes(1);
  now += 101;
  tick();
  expect(onExpire).toHaveBeenCalledWith(["OLD"]);
  expect(onTick).toHaveBeenCalledTimes(2);
  stop();
  expect(clearInterval).toHaveBeenCalledWith(42);
});

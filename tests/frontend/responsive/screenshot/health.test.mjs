import { expect, jest, test } from "@jest/globals";
import { checkScreenshotHealth } from "../../../../src/frontend/responsive/screenshot/health.mjs";

test("checks the radar health endpoint before screenshot work", async () => {
  const fetcher = jest.fn().mockResolvedValue({ ok: true, status: 200 });
  await expect(checkScreenshotHealth("http://127.0.0.1:3000", fetcher)).resolves.toBeUndefined();
  expect(fetcher).toHaveBeenCalledWith(new URL("http://127.0.0.1:3000/health"));
});

test("reports an unhealthy radar endpoint", async () => {
  await expect(
    checkScreenshotHealth("http://127.0.0.1:3000", async () => ({ ok: false, status: 503 })),
  ).rejects.toThrow("Radar health check failed with HTTP 503");
});

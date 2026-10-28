import { expect, test } from "@jest/globals";
import { checkScreenshotHealth } from "../../../../src/frontend/responsive/screenshot/health.mjs";

test("reports an unhealthy radar endpoint", async () => {
  await expect(
    checkScreenshotHealth("http://127.0.0.1:3000", async () => ({ ok: false, status: 503 })),
  ).rejects.toThrow("Radar health check failed with HTTP 503");
});

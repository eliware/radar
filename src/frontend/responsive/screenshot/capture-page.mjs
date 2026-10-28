import { createScreenshotPageSession } from "./page/session.mjs";

export function createScreenshotPageCapture(browser) {
  const errors = [];
  const pageSession = createScreenshotPageSession(browser);

  function capturePage(name, baseUrl, viewport, delayMs, capture) {
    return pageSession.capturePage(
      baseUrl,
      viewport,
      delayMs,
      (error) => errors.push(`${name}: ${error.message}`),
      capture,
    );
  }

  return {
    capturePage,
    assertNoPageErrors() {
      if (errors.length) throw new Error(`Browser errors:\n${errors.join("\n")}`);
    },
  };
}

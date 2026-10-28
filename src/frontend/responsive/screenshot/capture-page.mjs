import { createScreenshotPageSession } from "./page/session.mjs";
import { createScreenshotPageErrors } from "./page-errors.mjs";

export function createScreenshotPageCapture(browser) {
  const errors = createScreenshotPageErrors();
  const pageSession = createScreenshotPageSession(browser);

  function capturePage(name, baseUrl, viewport, delayMs, capture) {
    return pageSession.capturePage(
      baseUrl,
      viewport,
      delayMs,
      (error) => errors.record(name, error),
      capture,
    );
  }

  return {
    capturePage,
    assertNoPageErrors: errors.assertNone,
  };
}

import { default as createScreenshotPageSession } from "./page/session.mjs";
import { default as createScreenshotPageErrors } from "./page/errors.mjs";

function createScreenshotPageCapture(browser) {
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
export default createScreenshotPageCapture;

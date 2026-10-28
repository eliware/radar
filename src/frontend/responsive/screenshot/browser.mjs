export async function launchScreenshotBrowser(browserLauncher, browserArgs = []) {
  const browser = await browserLauncher.launch({ headless: true, args: browserArgs });
  return { browser, close: () => browser.close() };
}

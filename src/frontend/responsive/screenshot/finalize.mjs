export async function finalizeScreenshotSession(session, capture) {
  try {
    await capture();
  } finally {
    await session.close();
  }
  session.assertNoPageErrors();
}

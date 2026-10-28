export function createScreenshotPageErrors() {
  const errors = [];
  return {
    record(name, error) {
      errors.push(`${name}: ${error.message}`);
    },
    assertNone() {
      if (errors.length) throw new Error(`Browser errors:\n${errors.join("\n")}`);
    },
  };
}

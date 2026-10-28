export function hasPrimaryScreenshotOption(argumentsList) {
  return argumentsList.some(({ name }) => name === "primary");
}

export function parseAdsbOptionValue(argument, value) {
  if (!value || value.startsWith("--")) throw new Error(`Option ${argument} needs a value`);
  return value;
}

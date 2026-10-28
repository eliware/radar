import packageJson from "../../../package.json" with { type: "json" };

export function writeAdsbCliVersion(write) {
  write(packageJson.version);
}

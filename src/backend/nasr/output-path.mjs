import { fileURLToPath } from "node:url";

export const DEFAULT_OUTPUT = fileURLToPath(new URL("../../../nasr/NASR.sqlite", import.meta.url));

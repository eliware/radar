import { readFile } from "node:fs/promises";

const charsetSeparator = String.fromCharCode(59);

export async function sendStaticAsset(reply, file, type, read = readFile) {
  try {
    return reply.type(`${type}${charsetSeparator} charset=utf-8`).send(await read(file));
  } catch {
    return reply.code(404).type(`text/plain${charsetSeparator} charset=utf-8`).send("Not found");
  }
}
